import { NextResponse } from "next/server";
import { getSnapshot } from "@/features/threats/snapshot";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await getSnapshot(), {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=120" },
  });
}
