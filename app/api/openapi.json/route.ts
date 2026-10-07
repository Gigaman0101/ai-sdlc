import { NextResponse } from 'next/server';
import openApiSpec from '@/data/openapi.json';

export async function GET() {
  return NextResponse.json(openApiSpec, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
