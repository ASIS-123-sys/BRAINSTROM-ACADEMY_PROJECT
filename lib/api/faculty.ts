import { createClient } from "../supabase";

// get all faculty
export async function getAllFaculty() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .order("name");
  return { data, error };
}

// add faculty
export async function addFaculty(facultyData: {
  name: string;
  phone: string;
  subject: string;
  position: string;
  experience: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("faculty")
    .insert(facultyData)
    .select()
    .single();
  return { data, error };
}

// delete faculty
export async function deleteFaculty(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  return { error };
}

// upload faculty picture
export async function uploadFacultyPic(facultyId: string, file: File) {
  const supabase = createClient();
  const path = `faculty/${facultyId}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase
    .from("faculty")
    .update({ pic_url: data.publicUrl })
    .eq("id", facultyId);

  return { url: data.publicUrl, error: null };
}
