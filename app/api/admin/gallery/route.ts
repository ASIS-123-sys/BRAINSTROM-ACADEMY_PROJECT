export const runtime = "edge";
export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("event_name");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// ADD gallery image — accepts either a multipart file upload or a JSON image_url
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const contentType = request.headers.get("content-type") || "";

  let event_name: string;
  let image_url: string | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      // File upload path
      const formData = await request.formData();
      event_name = String(formData.get("event_name") || "").trim();
      const file = formData.get("file") as File | null;

      if (!event_name || !file) {
        return NextResponse.json(
          { error: "Event name and image file are required." },
          { status: 400 },
        );
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed." },
          { status: 400 },
        );
      }

      const MAX_SIZE = 8 * 1024 * 1024; // 8MB
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image must be smaller than 8MB." },
          { status: 400 },
        );
      }

      const ext = file.name.split(".").pop() || "jpg";
      const path = `events/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, arrayBuffer, { contentType: file.type });

      if (uploadError)
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 400 },
        );

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
    } else {
      // JSON / direct URL path (backward compatible)
      const body = await request.json();
      event_name = String(body.event_name || "").trim();
      image_url = body.image_url || null;

      if (!event_name || !image_url) {
        return NextResponse.json(
          { error: "Event Name and Image URL are required." },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase
      .from("gallery")
      .insert({ event_name, image_url })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong while adding the image." },
      { status: 500 },
    );
  }
}

// DELETE gallery image — also removes the file from Storage if it lives there
export async function DELETE(request: Request) {
  const supabase = createAdminClient();
  const { id } = await request.json();

  const { data: existing } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  if (existing?.image_url?.includes("/gallery/")) {
    const path = existing.image_url.split("/gallery/")[1];
    if (path) {
      await supabase.storage.from("gallery").remove([path]);
    }
  }

  return NextResponse.json({ success: true });
}
