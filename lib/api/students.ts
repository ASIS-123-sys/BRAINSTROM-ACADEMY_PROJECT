import { createClient } from "../supabase";

// get all students
export async function getAllStudents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name");
  return { data, error };
}

// get single student by id
export async function getStudentById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

// get top students for public excellence section
export async function getTopStudents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("name, batch, rank, profile_pic_url")
    .order("rank", { ascending: true })
    .limit(10);
  return { data, error };
}

// add new student
export async function addStudent(studentData: {
  name: string;
  phone: string;
  batch: string;
  enrollment_id: string;
}) {
  const supabase = createClient();
  const email = `${studentData.enrollment_id}@brainstorm.local`;
  const defaultPassword = `BA@${studentData.enrollment_id}`;

  // step 1 - create auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
    });
  if (authError) return { data: null, error: authError };

  // step 2 - insert into students table
  const { data, error } = await supabase
    .from("students")
    .insert({
      id: authData.user.id,
      enrollment_id: studentData.enrollment_id,
      name: studentData.name,
      phone: studentData.phone,
      batch: studentData.batch,
    })
    .select()
    .single();

  return { data, error };
}

// delete student
export async function deleteStudent(id: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  return { error };
}

// upload student profile picture
export async function uploadStudentPic(studentId: string, file: File) {
  const supabase = createClient();
  const path = `students/${studentId}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase
    .from("students")
    .update({ profile_pic_url: data.publicUrl })
    .eq("id", studentId);

  return { url: data.publicUrl, error: null };
}
