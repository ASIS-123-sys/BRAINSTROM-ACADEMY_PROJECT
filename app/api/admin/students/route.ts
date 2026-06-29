import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ADD student
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();
  const { name, phone, batch, enrollment_id, course } = body;

  const email = `${enrollment_id}@brainstorm.local`;
  const defaultPassword = `BS@${enrollment_id}`;

  // create auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
    });
  if (authError)
    return NextResponse.json({ error: authError.message }, { status: 400 });

  // insert into students table
  const { data, error } = await supabase
    .from("students")
    .insert({
      id: authData.user.id,
      enrollment_id,
      name,
      phone,
      batch,
      course,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// DELETE student
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
