export async function getSettings() {
  const response = await fetch("/api/settings", {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: null, error: new Error("Failed to load settings") };
  }

  const json = await response.json();
  return { data: json.data ?? null, error: null };
}

export async function updateSettings(data: Record<string, unknown>) {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    return {
      data: null,
      error: new Error(json.error || "Failed to save settings"),
    };
  }

  const json = await response.json();
  return { data: json.data ?? null, error: null };
}
