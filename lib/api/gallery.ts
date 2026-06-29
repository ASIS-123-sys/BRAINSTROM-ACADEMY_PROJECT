import { createClient } from "../supabase";

// get all gallery images
export async function getGallery() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("event_name");
  return { data, error };
}

// get images by event name
export async function getGalleryByEvent(eventName: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("event_name", eventName);
  return { data, error };
}

// add gallery image
export async function addGalleryImage(eventName: string, file: File) {
  const supabase = createClient();
  const path = `events/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file);

  if (uploadError) return { data: null, error: uploadError };

  const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);

  const { data, error } = await supabase
    .from("gallery")
    .insert({ event_name: eventName, image_url: urlData.publicUrl })
    .select()
    .single();

  return { data, error };
}

// delete gallery image
export async function deleteGalleryImage(id: string, imageUrl: string) {
  const supabase = createClient();

  // extract path from url
  const path = imageUrl.split("/gallery/")[1];

  await supabase.storage.from("gallery").remove([path]);

  const { error } = await supabase.from("gallery").delete().eq("id", id);

  return { error };
}
