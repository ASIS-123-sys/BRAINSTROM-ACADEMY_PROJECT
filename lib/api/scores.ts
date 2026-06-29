import { createClient } from "../supabase";

// get all scores for a student
export async function getStudentScores(studentId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false });
  return { data, error };
}

// get scores filtered by year
export async function getScoresByYear(studentId: string, year: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("student_id", studentId)
    .gte("test_date", `${year}-01-01`)
    .lte("test_date", `${year}-12-31`)
    .order("test_date", { ascending: false });
  return { data, error };
}

// get scores filtered by month
export async function getScoresByMonth(
  studentId: string,
  year: number,
  month: number,
) {
  const supabase = createClient();
  const paddedMonth = String(month).padStart(2, "0");
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("student_id", studentId)
    .gte("test_date", `${year}-${paddedMonth}-01`)
    .lte("test_date", `${year}-${paddedMonth}-31`)
    .order("test_date", { ascending: false });
  return { data, error };
}

// add score
export async function addScore(scoreData: {
  student_id: string;
  subject: string;
  score: number;
  total: number;
  test_date: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scores")
    .insert(scoreData)
    .select()
    .single();
  return { data, error };
}

// delete score
export async function deleteScore(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("scores").delete().eq("id", id);
  return { error };
}
