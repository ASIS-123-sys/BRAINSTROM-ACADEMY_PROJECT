export const runtime = "edge";
export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("settings").select("*").limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: data?.[0] ?? null });
}

export async function PATCH(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  const { data: existingRows, error: fetchError } = await supabase
    .from("settings")
    .select("id")
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  if (existingRows && existingRows.length > 0) {
    const { data, error } = await supabase
      .from("settings")
      .update(body)
      .eq("id", existingRows[0].id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  }

  const { data, error } = await supabase
    .from("settings")
    .insert({ ...body, id: crypto.randomUUID() })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
