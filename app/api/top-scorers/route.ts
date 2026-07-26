export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Public read-only top scorers list — used by the homepage "Best Scorers" section.
// Uses the admin client (server-side only) so RLS doesn't block it.
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, name, batch, rank, percentage, profile_pic_url")
    .eq("is_top_scorer", true)
    .order("rank", { ascending: true })
    .limit(10);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}
