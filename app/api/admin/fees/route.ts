export const runtime = "edge";
export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
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

// ADD fee record
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
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// UPDATE fee - mark as paid
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
