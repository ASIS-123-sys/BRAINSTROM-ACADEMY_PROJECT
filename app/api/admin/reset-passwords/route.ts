import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createAdminClient();

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, enrollment_id, name");

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 400 });
  }

  if (!students || students.length === 0) {
    return NextResponse.json({ updated: 0, failed: [] });
  }

  const failed: { enrollment_id: string; error: string }[] = [];
  let updated = 0;

  for (const student of students) {
    const newPassword = `BS@${student.enrollment_id}`;
    const { error } = await supabase.auth.admin.updateUserById(student.id, {
      password: newPassword,
    });

    if (error) {
      failed.push({
        enrollment_id: student.enrollment_id,
        error: error.message,
      });
    } else {
      updated++;
    }
  }

  return NextResponse.json({ updated, failed, total: students.length });
}
