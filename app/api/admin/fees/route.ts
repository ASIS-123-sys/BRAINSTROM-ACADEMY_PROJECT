export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { sendPushToStudent } from "@/lib/push";
import { NextResponse } from "next/server";

// GET all fees
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fees")
    .select("*, students(name, enrollment_id)")
    .order("due_date", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// ADD fee record — pushes a browser notification to that student
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { student_id, total_amount, paid_amount, due_date, status } = body;

    const { data, error } = await supabase
      .from("fees")
      .insert({ student_id, total_amount, paid_amount, due_date, status })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    if (status !== "paid") {
      const due = total_amount - (paid_amount || 0);
      const pushResult = await sendPushToStudent(student_id, {
        title: "Fee Due",
        body: `Rs.${due} is due by ${due_date}.`,
        url: "/student/fees",
      });
      console.log("Fee-due push result:", pushResult);
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// UPDATE fee - mark as paid — pushes a browser notification with new status
export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient();
    const { id, paid_amount, total_amount } = await request.json();

    const status =
      paid_amount >= total_amount
        ? "paid"
        : paid_amount > 0
          ? "partial"
          : "due";

    const { data, error } = await supabase
      .from("fees")
      .update({ paid_amount, status })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const studentId = data?.student_id;
    if (studentId) {
      const remaining = total_amount - paid_amount;
      const pushResult = await sendPushToStudent(studentId, {
        title: status === "paid" ? "Fee Payment Received" : "Fee Payment Update",
        body:
          status === "paid"
            ? `Your payment of Rs.${paid_amount} has been received in full. Thank you!`
            : `Payment of Rs.${paid_amount} received. Rs.${remaining} still due.`,
        url: "/student/fees",
      });
      console.log("Fee-update push result:", pushResult);
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE fee record
export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient();
    const { id } = await request.json();

    const { error } = await supabase.from("fees").delete().eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
