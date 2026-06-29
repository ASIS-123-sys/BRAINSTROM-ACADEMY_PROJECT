import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ADD gallery image
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const { event_name, image_url } = await request.json();

  const { data, error } = await supabase
    .from("gallery")
    .insert({ event_name, image_url })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// DELETE gallery image
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
