"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import openApiSpec from "@/data/openapi.json";

declare global {
  interface Window {
    SwaggerUIBundle?: {
      (options: Record<string, unknown>): unknown;
      presets: { apis: unknown };
    };
    SwaggerUIStandalonePreset?: unknown;
  }
}

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Inject local stylesheet
    if (!document.getElementById("swagger-ui-local-css")) {
      const link = document.createElement("link");
      link.id = "swagger-ui-local-css";
      link.rel = "stylesheet";
      link.href = "/swagger-ui/swagger-ui.css";
      document.head.appendChild(link);
    }

    // Function to mount Swagger UI
    const mountSwaggerUI = () => {
      if (!isMounted || initializedRef.current) return;
      if (typeof window.SwaggerUIBundle === "function" && containerRef.current) {
        try {
          window.SwaggerUIBundle({
            domNode: containerRef.current,
            dom_id: "swagger-ui-container",
            spec: openApiSpec,
            deepLinking: true,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              ...(window.SwaggerUIStandalonePreset ? [window.SwaggerUIStandalonePreset] : []),
            ],
            layout: "BaseLayout",
            docExpansion: "list",
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            displayRequestDuration: true,
            filter: true,
            showExtensions: true,
          });
          initializedRef.current = true;
          setIsLoading(false);
        } catch (err) {
          console.error("Error initializing Swagger UI:", err);
          setErrorMessage("ไม่สามารถเรนเดอร์ Swagger UI ได้ กรุณาลองรีเฟรชหน้าเว็บ");
          setIsLoading(false);
        }
      }
    };

    // 2. Load scripts sequentially from local /swagger-ui
    const loadScript = (id: string, src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.getElementById(id) as HTMLScriptElement | null;
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      try {
        await loadScript("swagger-ui-bundle-js", "/swagger-ui/swagger-ui-bundle.js");
        await loadScript("swagger-ui-preset-js", "/swagger-ui/swagger-ui-standalone-preset.js");
        mountSwaggerUI();
      } catch (err) {
        if (isMounted) {
          console.error("Script load error:", err);
          setErrorMessage("ไม่สามารถโหลดไฟล์ Swagger UI ในเครื่องได้");
          setIsLoading(false);
        }
      }
    };

    init();

    // Safety timeout in case scripts take too long
    const timer = setTimeout(() => {
      if (isMounted && !initializedRef.current) {
        mountSwaggerUI();
        if (!initializedRef.current) {
          setIsLoading(false);
        }
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-emerald-700 transition">
                F
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Farmart <span className="text-emerald-600">API Docs</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">Interactive Swagger UI</span>
              </div>
            </Link>

            {/* Badges */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                v1.0.0
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                OpenAPI 3.0.3
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                Local Fast-Load
              </span>
            </div>
          </div>

          {/* Action Links & Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="/api/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
              title="Open raw OpenAPI Specification JSON"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Raw JSON</span>
            </a>

            <a
              href="/api/openapi.json"
              download="farmart-openapi-spec.json"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-200"
              title="Download openapi.json file"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-slate-700 font-semibold text-sm">กำลังโหลด Swagger UI Specification...</p>
            <p className="text-slate-400 text-xs mt-1">โหลดข้อมูลจาก Local Assets แบบรวดเร็ว</p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-6">
            <p className="font-semibold text-sm">แจ้งเตือน</p>
            <p className="text-xs mt-1">{errorMessage}</p>
            <a
              href="/api/openapi.json"
              className="inline-block mt-2 text-xs font-semibold underline hover:text-red-900"
            >
              คลิกที่นี่เพื่อเปิดดู Raw OpenAPI JSON Spec โดยตรง
            </a>
          </div>
        )}

        {/* Swagger UI Mount Point Container */}
        <div
          ref={containerRef}
          id="swagger-ui-container"
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 sm:p-6 transition-opacity duration-200"
          style={{ display: isLoading ? "none" : "block" }}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Farmart Supermarket Platform &bull; OpenAPI 3.0.3 Specification &bull; Built with Next.js App Router</p>
      </footer>
    </div>
  );
}
