import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date();

  const { data: fees } = await supabase
    .from("fees")
    .select("*, students(name, phone)")
    .neq("status", "paid");

  for (const fee of fees || []) {
    const dueDate = new Date(fee.due_date);
    const daysUntilDue = Math.floor(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    const lastReminder = fee.last_reminder_sent
      ? new Date(fee.last_reminder_sent)
      : null;
    const daysSinceReminder = lastReminder
      ? Math.floor(
          (today.getTime() - lastReminder.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 999;

    const shouldRemind =
      daysUntilDue === 8 || (daysUntilDue < 8 && daysSinceReminder >= 2);

    if (shouldRemind) {
      console.log(`Remind: ${fee.students.name} — due in ${daysUntilDue} days`);
      await supabase
        .from("fees")
        .update({ last_reminder_sent: today.toISOString().split("T")[0] })
        .eq("id", fee.id);
    }
  }

  return NextResponse.json({ success: true });
}
