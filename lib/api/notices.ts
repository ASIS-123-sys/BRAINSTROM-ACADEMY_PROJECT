import { createClient } from "../supabase";

// get all notices - newest first
export async function getNotices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

// add notice - trigger in DB auto deletes oldest if more than 5
export async function addNotice(title: string, content: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notices")
    .insert({ title, content })
    .select()
    .single();
  return { data, error };
}
