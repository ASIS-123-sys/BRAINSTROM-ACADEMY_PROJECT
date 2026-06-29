import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

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
