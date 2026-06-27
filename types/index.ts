export type Student = {
  id: string;
  enrollment_id: string;
  name: string;
  phone: string;
  batch: string;
  rank: number;
  profile_pic_url: string;
  created_at: string;
};

export type Faculty = {
  id: string;
  name: string;
  phone: string;
  subject: string;
  position: string;
  experience: string;
  pic_url: string;
  created_at: string;
};

export type Course = {
  id: string;
  category: string;
  name: string;
  facilities: string[];
  created_at: string;
};

export type Score = {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  total: number;
  test_date: string;
  created_at: string;
};

export type Fee = {
  id: string;
  student_id: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
  status: "paid" | "due" | "partial";
  last_reminder_sent: string | null;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  event_name: string;
  image_url: string;
  created_at: string;
};

export type Admin = {
  id: string;
  preset_phone: string;
};
