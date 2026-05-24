import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const VAANI_API = process.env.VAANI_API_URL ?? "https://vaani-ai-production.up.railway.app";
const VAANI_SITE = process.env.VAANI_SITE_ID ?? "";
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId") ?? "";
  try {
    const r = await fetch(`${VAANI_API}/api/payment/status/${orderId}?siteId=${VAANI_SITE}`);
    const data = await r.json();
    return NextResponse.json(data);
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}