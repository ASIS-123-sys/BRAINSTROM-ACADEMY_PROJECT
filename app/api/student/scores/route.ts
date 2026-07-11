export const runtime = "edge";
export const dynamic = "force-dynamic";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Get current logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch student record to get the student's id
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("id", user.id)
    .single();

  if (studentError || !student) {
    return NextResponse.json(
      { error: "Student record not found" },
      { status: 404 },
    );
  }

  // Fetch scores where student_id matches student.id ordered by test_date descending
  const { data: scores, error: scoresError } = await supabase
    .from("scores")
    .select("*")
    .eq("student_id", student.id)
    .order("test_date", { ascending: false });

  if (scoresError) {
    return NextResponse.json({ error: scoresError.message }, { status: 400 });
  }

  return NextResponse.json({ data: scores });
}
