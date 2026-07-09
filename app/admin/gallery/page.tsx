"use client";

import React, { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type GalleryRow = {
  id: string;
  event_name: string;
  image_url: string;
  created_at: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      if (json.data) setImages(json.data as GalleryRow[]);
    } catch {
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChosen(file: File | null) {
    setError(null);
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChosen(file);
  }

  function resetForm() {
    setEventName("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!eventName.trim() || !selectedFile) {
      setError("Event name and an image file are required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("event_name", eventName.trim());
      formData.append("file", selectedFile);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setImages((prev) =>
        [...prev, json.data as GalleryRow].sort((a, b) =>
          a.event_name.localeCompare(b.event_name),
        ),
      );
      resetForm();
      setIsModalOpen(false);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting image: " + json.error);
      } else {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const glassStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const labelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition";

  return (
    <div className={`space-y-8 ${poppins.className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003358]">
            Manage Gallery
          </h1>
          <p className="text-sm text-[#42576E] mt-1">
            {loading
              ? "Loading…"
              : `${images.length} image${images.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none shrink-0"
        >
          + Add Image
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#42576E] animate-pulse">
              Fetching gallery…
            </p>
          </div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div
          style={glassStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">🖼️</span>
          <p className="text-[#003358] font-semibold text-lg">
            No images found
          </p>
          <p className="text-[#42576E] text-sm">
            Add your first image to the gallery.
          </p>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none mt-2"
          >
            + Add Image
          </Button>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div style={glassStyle} className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl aspect-square overflow-hidden bg-[#9FC7F0]/30 border border-[#7FB3E8]"
              >
                <img
                  src={img.image_url}
                  alt={img.event_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#003358]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-sm font-semibold text-white mb-3 leading-snug">
                    {img.event_name}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id}
                    className="text-rose-700 hover:text-rose-600 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deletingId === img.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Add New Image"
        size="md"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-image-form"
              isLoading={submitting}
              className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none"
            >
              Add Image
            </Button>
          </div>
        }
      >
        <form id="add-image-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="image-event-name" className={labelClass}>
              Event Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="image-event-name"
              type="text"
              required
              placeholder="e.g. Annual Sports Day"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Image <span className="text-rose-400">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-blue-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChosen(e.target.files?.[0] || null)}
              />

              {previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                  <p className="text-xs text-gray-500">
                    {selectedFile?.name} — click or drop to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6">
                  <span className="text-3xl">📤</span>
                  <p className="text-sm font-semibold text-gray-700">
                    Click to browse or drag an image here
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, or WEBP up to 8MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
