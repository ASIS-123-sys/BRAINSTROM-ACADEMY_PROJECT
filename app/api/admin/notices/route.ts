import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ADD notice
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const { title, content } = await request.json();

  const { data, error } = await supabase
    .from("notices")
    .insert({ title, content })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// DELETE notice
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
