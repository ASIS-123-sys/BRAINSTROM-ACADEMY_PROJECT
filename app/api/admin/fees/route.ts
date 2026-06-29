import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ADD fee record
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("fees")
    .insert(body)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// UPDATE fee status
export async function PATCH(request: Request) {
  const supabase = createAdminClient();
  const { id, paid_amount, total_amount } = await request.json();

  const status =
    paid_amount >= total_amount ? "paid" : paid_amount > 0 ? "partial" : "due";

  const { data, error } = await supabase
    .from("fees")
    .update({ paid_amount, status })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// DELETE fee record
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { error } = await supabase.from("fees").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
