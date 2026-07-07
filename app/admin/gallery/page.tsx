"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Local row type
type GalleryRow = {
  id: string;
  event_name: string;
  image_url: string;
  created_at: string;
};

const defaultForm = { event_name: "", image_url: "" };

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all images via API route (uses service-role client) ──────────
  useEffect(() => {
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
    fetchGallery();
  }, []);

  // ─── Add image ────────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.event_name.trim() || !form.image_url.trim()) {
      setError("Event Name and Image URL are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: form.event_name,
          image_url: form.image_url,
        }),
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
      setForm(defaultForm);
      setIsModalOpen(false);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Delete image ─────────────────────────────────────────────────────────
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

  // ─── Shared styles ────────────────────────────────────────────────────────
  const glassStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const labelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-8 ${poppins.className}`}>
      {/* Page header */}
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
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none shrink-0"
        >
          + Add Image
        </Button>
      </div>

      {/* ─── Loading state ─── */}
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

      {/* ─── Empty state ─── */}
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
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none mt-2"
          >
            + Add Image
          </Button>
        </div>
      )}

      {/* ─── Gallery Grid ─── */}
      {!loading && images.length > 0 && (
        <div style={glassStyle} className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl aspect-square overflow-hidden bg-[#9FC7F0]/30 border border-[#7FB3E8]"
              >
                {/* Image */}
                <img
                  src={img.image_url}
                  alt={img.event_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
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

      {/* ─── Add Image Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
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
                setError(null);
                setForm(defaultForm);
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

          {/* Event Name */}
          <div>
            <label htmlFor="image-event-name" className={labelClass}>
              Event Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="image-event-name"
              type="text"
              required
              placeholder="e.g. Annual Sports Day"
              value={form.event_name}
              onChange={(e) => setForm({ ...form, event_name: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image-url" className={labelClass}>
              Image URL <span className="text-rose-400">*</span>
            </label>
            <input
              id="image-url"
              type="url"
              required
              placeholder="https://example.com/image.jpg"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
 