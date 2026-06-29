import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if not logged in send to admin login page
  if (!user) {
    redirect("/auth/admin-login");
  }

  return (
    <div>
      {/* Admin Navigation */}
      <nav
        style={{
          background: "#1e293b",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Brainstorm Academy — Admin</h2>
        <div style={{ display: "flex", gap: 16 }}>
          <a
            href="/admin/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            Dashboard
          </a>
          <a
            href="/admin/students"
            style={{ color: "white", textDecoration: "none" }}
          >
            Students
          </a>
          <a
            href="/admin/faculty"
            style={{ color: "white", textDecoration: "none" }}
          >
            Faculty
          </a>
          <a
            href="/admin/notices"
            style={{ color: "white", textDecoration: "none" }}
          >
            Notices
          </a>
          <a
            href="/admin/gallery"
            style={{ color: "white", textDecoration: "none" }}
          >
            Gallery
          </a>
          <a
            href="/admin/scores"
            style={{ color: "white", textDecoration: "none" }}
          >
            Scores
          </a>
          <a
            href="/admin/fees"
            style={{ color: "white", textDecoration: "none" }}
          >
            Fees
          </a>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
