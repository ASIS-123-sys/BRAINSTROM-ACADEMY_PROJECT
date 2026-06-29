import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/student-login");
  }

  return <div>{children}</div>;
}
