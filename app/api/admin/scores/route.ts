import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ADD score
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("scores")
    .insert(body)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// DELETE score
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { error } = await supabase.from("scores").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
