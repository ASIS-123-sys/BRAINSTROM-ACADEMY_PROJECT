export const runtime = "edge";
export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Public read-only faculty list — used by the public "Faculty" page.
// Uses the admin client (server-side only) so RLS doesn't block it,
// but only ever exposes GET — no write access from this route.
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("faculty")
    .select("id, name, subject, position, experience, pic_url")
    .order("name");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}
