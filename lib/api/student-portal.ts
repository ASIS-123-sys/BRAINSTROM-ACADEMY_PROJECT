import { createClient } from "../supabase";

// get logged in student profile
export async function getMyProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

// get my scores
export async function getMyScores(studentId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false });
  return { data, error };
}

// get my fees
export async function getMyFees(studentId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fees")
    .select("*")
    .eq("student_id", studentId)
    .order("due_date", { ascending: false });
  return { data, error };
}
