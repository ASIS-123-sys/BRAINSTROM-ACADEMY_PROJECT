import { createClient } from "../supabase";

// get all fees for a student
export async function getStudentFees(studentId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fees")
    .select("*")
    .eq("student_id", studentId)
    .order("due_date", { ascending: false });
  return { data, error };
}

// get all fees - for admin
export async function getAllFees() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fees")
    .select("*, students(name, enrollment_id)")
    .order("due_date", { ascending: true });
  return { data, error };
}

// add fee record
export async function addFee(feeData: {
  student_id: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
}) {
  const supabase = createClient();
  const status =
    feeData.paid_amount >= feeData.total_amount
      ? "paid"
      : feeData.paid_amount > 0
        ? "partial"
        : "due";

  const { data, error } = await supabase
    .from("fees")
    .insert({ ...feeData, status })
    .select()
    .single();
  return { data, error };
}

// update fee payment
export async function updateFeePayment(
  id: string,
  paidAmount: number,
  totalAmount: number,
) {
  const supabase = createClient();
  const status =
    paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "due";

  const { data, error } = await supabase
    .from("fees")
    .update({ paid_amount: paidAmount, status })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

// get all due fees - used by cron job
export async function getDueFees() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fees")
    .select("*, students(name, phone)")
    .neq("status", "paid");
  return { data, error };
}
