export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET all top scorers
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("students")
    .select(
      "id, name, enrollment_id, batch, rank, percentage, profile_pic_url, course",
    )
    .eq("is_top_scorer", true)
    .order("rank", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// UPDATE student to mark as top scorer
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const { student_id, rank, percentage } = await request.json();

  if (!student_id || !rank || !percentage) {
    return NextResponse.json(
      { error: "student_id, rank and percentage are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("students")
    .update({ is_top_scorer: true, rank, percentage })
    .eq("id", student_id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// REMOVE student from top scorers
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { student_id } = await request.json();

  const { error } = await supabase
    .from("students")
    .update({ is_top_scorer: false, rank: null, percentage: null })
    .eq("id", student_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
