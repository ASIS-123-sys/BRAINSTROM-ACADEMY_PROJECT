import { createClient } from "../supabase";

// get all courses
export async function getAllCourses() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("category");
  return { data, error };
}

// get courses by category
export async function getCoursesByCategory(category: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("category", category);
  return { data, error };
}

// add course
export async function addCourse(courseData: {
  name: string;
  category: string;
  facilities: string[];
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .insert(courseData)
    .select()
    .single();
  return { data, error };
}

// delete course
export async function deleteCourse(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  return { error };
}
