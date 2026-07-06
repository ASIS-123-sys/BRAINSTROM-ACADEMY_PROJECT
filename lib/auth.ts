import { createClient } from "./supabase";

export async function loginStudent(identifier: string, password: string) {
  const supabase = createClient();
  const email = identifier.includes("@")
    ? identifier
    : `${identifier}@brainstorm.local`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function loginAdmin(adminId: string, password: string) {
  const supabase = createClient();
  const email = `${adminId}@brainstorm-admin.local`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function sendOTP(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });
  return { error };
}

export async function verifyOTPAndReset(
  email: string,
  token: string,
  newPassword: string,
) {
  const supabase = createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (verifyError) return { error: verifyError };

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error: updateError };
}
