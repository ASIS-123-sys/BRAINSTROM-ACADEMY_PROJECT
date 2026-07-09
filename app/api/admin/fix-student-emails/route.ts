import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// One-time fix: some students may have been created with a real email
// address as their login identity instead of <enrollment_id>@brainstorm.local.
// This realigns every student's auth email to the enrollment-ID pattern so
// login by Enrollment ID always works, matching the reset-passwords route.
export async function POST() {
  const supabase = createAdminClient();

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, enrollment_id");

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 400 });
  }

  if (!students || students.length === 0) {
    return NextResponse.json({ updated: 0, failed: [] });
  }

  const failed: { enrollment_id: string; error: string }[] = [];
  let updated = 0;

  for (const student of students) {
    const correctEmail = `${student.enrollment_id}@brainstorm.local`;
    const { error } = await supabase.auth.admin.updateUserById(student.id, {
      email: correctEmail,
      email_confirm: true,
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
