import { createClient } from "../supabase";

export async function getSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*").single();
  return { data, error };
}

export async function updateSettings(data: Record<string, unknown>) {
  const supabase = createClient();
  const { data: updatedData, error } = await supabase
    .from("settings")
    .update(data)
    .eq("id", 1)
    .select()
    .single();

  return { data: updatedData, error };
}
