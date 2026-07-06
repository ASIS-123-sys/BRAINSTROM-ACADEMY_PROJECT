"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Settings = {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  year_established: string;
  about_text: string;
  owner_name: string;
  owner_title: string;
};

const defaultSettings: Settings = {
  phone1: "",
  phone2: "",
  email1: "",
  email2: "",
  address: "",
  year_established: "",
  about_text: "",
  owner_name: "",
  owner_title: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const glassCardStyle = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.4)",
    border: "1px solid #7FB3E8",
    borderRadius: "10px",
    color: "#1E3A52",
    outline: "none",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    transition: "border-color 0.2s",
  };

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.data) {
          setSettings({ ...defaultSettings, ...json.data });
        }
      } catch {
        setErrorMsg("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to save settings.");
      } else {
        setSuccessMsg("Settings saved successfully!");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldGroups = [
    {
      title: "Contact Information",
      icon: "📞",
      fields: [
        { label: "Phone 1", name: "phone1", type: "text", placeholder: "+91 99338 25835" },
        { label: "Phone 2", name: "phone2", type: "text", placeholder: "+91 20085 48156" },
        { label: "Email 1", name: "email1", type: "email", placeholder: "info@brainstormacademy.in" },
        { label: "Email 2", name: "email2", type: "email", placeholder: "admissions@brainstormacademy.in" },
        { label: "Address", name: "address", type: "text", placeholder: "Near Radio Station, Berhampur, Odisha" },
      ],
    },
    {
      title: "Academy Information",
      icon: "🏫",
      fields: [
        { label: "Year Established", name: "year_established", type: "text", placeholder: "2010" },
        { label: "Owner Name", name: "owner_name", type: "text", placeholder: "Mr. Asis Kumar" },
        { label: "Owner Title", name: "owner_title", type: "text", placeholder: "Founder and Director" },
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-[#F7FAFD] text-[#003358] ${poppins.className}`}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#003358] tracking-tight">
              Academy Settings
            </h1>
            <p className="text-sm text-[#42576E] mt-1">
              Manage contact details and general academy information
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#9FC7F0] border border-[#7FB3E8] flex items-center justify-center text-xl">
            ⚙️
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            style={glassCardStyle}
            className="p-12 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-8 h-8 border-2 border-[#2dbcfe] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#42576E]">Loading settings…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Field Groups */}
            {fieldGroups.map((group) => (
              <div key={group.title} style={glassCardStyle} className="p-6 space-y-5">
                {/* Group Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-[#7FB3E8]/50">
                  <span className="text-lg">{group.icon}</span>
                  <h2 className="text-sm font-bold text-[#003358] uppercase tracking-widest">
                    {group.title}
                  </h2>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {group.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`flex flex-col gap-1.5 ${field.name === "address" ? "sm:col-span-2" : ""}`}
                    >
                      <label
                        htmlFor={field.name}
                        className="text-xs font-semibold text-[#42576E] uppercase tracking-wider"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={settings[field.name as keyof Settings]}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#2dbcfe")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#7FB3E8")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* About Text — full-width card */}
            <div style={glassCardStyle} className="p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#7FB3E8]/50">
                <span className="text-lg">📝</span>
                <h2 className="text-sm font-bold text-[#003358] uppercase tracking-widest">
                  About Text
                </h2>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="about_text"
                  className="text-xs font-semibold text-[#42576E] uppercase tracking-wider"
                >
                  About the Academy
                </label>
                <textarea
                  id="about_text"
                  name="about_text"
                  rows={6}
                  placeholder="Describe the academy's mission, values, and history…"
                  value={settings.about_text}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2dbcfe")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#7FB3E8")}
                />
              </div>
            </div>

            {/* Status Messages */}
            {successMsg && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-semibold">
                <span>✅</span>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm font-semibold">
                <span>❌</span>
                {errorMsg}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-[#2dbcfe] text-[#003358] hover:bg-[#20a8e8] active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#003358] border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Settings
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
