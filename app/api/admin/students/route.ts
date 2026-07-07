import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { name, phone, batch, enrollment_id, course, email } = body;

    if (!name || !enrollment_id) {
      return NextResponse.json(
        { error: "Name and Enrollment ID are required" },
        { status: 400 },
      );
    }

    const loginEmail = email?.trim() || `${enrollment_id}@brainstorm.local`;
    const defaultPassword = `BS@${enrollment_id}`;

    // step 1 - create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: loginEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: { enrollment_id, role: "student" },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // step 2 - insert into students table
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

    if (error) {
      // if insert fails delete the auth user to keep things clean
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // step 1 - delete from students table first
    const { error: dbError } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    // step 2 - delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
