"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Farmart Accessible Tabs Component
 * Follows DESIGN.md:
 * - Touch targets >= 44px
 * - Active indicator in primary yellow #FAB528
 * - Slate-900 high contrast ink for active typography
 */
export function Tabs({ tabs, defaultTab, onChange, className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation List */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto scrollbar-none pb-px"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 min-h-[44px] text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none rounded-t-[6px] ${
                isActive
                  ? "text-[#0F172A] bg-white border-t-2 border-[#FAB528] -mb-px border-x border-[#E2E8F0]"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#FAB528] text-black font-bold"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white -mb-px" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      {currentTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${currentTab.id}`}
          aria-labelledby={`tab-${currentTab.id}`}
          className="pt-6 animate-in fade-in duration-200"
        >
          {currentTab.content}
        </div>
      )}
    </div>
  );
}
