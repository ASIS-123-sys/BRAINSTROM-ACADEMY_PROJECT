"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { loginStudent, sendOTP, verifyOTPAndReset } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// pre-warms the connection before user even clicks anything
const supabase = createClient();
supabase.auth.getSession();

export default function StudentLoginPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"login" | "forgot" | "otp">("login");

  const [enrollmentId, setEnrollmentId] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [state, setState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  async function handleLogin() {
    if (!enrollmentId || !password) {
      setState({
        loading: false,
        error: "Please enter your Enrollment ID/Email and password",
        success: "",
      });
      return;
    }
    setState({ loading: true, error: "", success: "" });
    const { error } = await loginStudent(enrollmentId, password);
    if (error) {
      setState({
        loading: false,
        error: "Invalid Enrollment ID or password",
        success: "",
      });
    } else {
      // small delay to let session cookie set properly
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/student/dashboard");
    }
  }

  async function handleSendOTP() {
    if (!otpEmail) {
      setState({
        loading: false,
        error: "Please enter your email",
        success: "",
      });
      return;
    }
    setState({ loading: true, error: "", success: "" });
    const { error } = await sendOTP(otpEmail);
    if (error) {
      setState({
        loading: false,
        error: "Could not send OTP. Check your email and try again.",
        success: "",
      });
    } else {
      setState({
        loading: false,
        error: "",
        success: "OTP sent to your email",
      });
      setScreen("otp");
    }
  }

  async function handleReset() {
    if (!otp) {
      setState({ loading: false, error: "Please enter the OTP", success: "" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setState({
        loading: false,
        error: "Passwords do not match",
        success: "",
      });
      return;
    }
    if (newPassword.length < 6) {
      setState({
        loading: false,
        error: "Password must be at least 6 characters",
        success: "",
      });
      return;
    }
    setState({ loading: true, error: "", success: "" });
    const { error } = await verifyOTPAndReset(otpEmail, otp, newPassword);
    if (error) {
      setState({
        loading: false,
        error: "Invalid OTP or expired. Try again.",
        success: "",
      });
    } else {
      setState({
        loading: false,
        error: "",
        success: "Password reset successfully. Please log in.",
      });
      setScreen("login");
    }
  }

  // Common UI classes
  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]/50 text-sm transition";
  const buttonClass =
    "w-full bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-[#0F172A] font-bold rounded-xl px-4 py-3 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div
      className={`min-h-screen bg-[#0F172A] flex flex-col justify-center relative overflow-hidden ${poppins.className}`}
    >
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#06B6D4] rounded-full blur-[120px] opacity-15 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-15 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto p-4">
        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl p-10 shadow-2xl">
          {/* LOGIN SCREEN */}
          {screen === "login" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#06B6D4]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#06B6D4]/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <span className="text-3xl">👨‍🎓</span>
                </div>
                <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  Student Login
                </h1>
                <p className="text-sm text-[#94A3B8]">
                  Access your academic portal
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={enrollmentId}
                  onChange={(e) => setEnrollmentId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enrollment ID or Email"
                  className={inputClass}
                  autoComplete="off"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Password"
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>

              {state.error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}
              {state.success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {state.success}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <button
                  onClick={handleLogin}
                  disabled={state.loading}
                  className={buttonClass}
                >
                  {state.loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setScreen("forgot");
                      setState({ loading: false, error: "", success: "" });
                    }}
                    className="text-xs font-semibold text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD SCREEN */}
          {screen === "forgot" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F59E0B]/20">
                  <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  Reset Password
                </h1>
                <p className="text-sm text-[#94A3B8]">
                  Enter the email linked to your student account
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>

              {state.error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <button
                  onClick={handleSendOTP}
                  disabled={state.loading}
                  className={buttonClass}
                >
                  {state.loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setScreen("login");
                      setState({ loading: false, error: "", success: "" });
                    }}
                    className="text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTP SCREEN */}
          {screen === "otp" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  Create Password
                </h1>
                <p className="text-sm text-[#94A3B8]">
                  Enter the OTP sent to your email
                </p>
              </div>

              {state.success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {state.success}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className={inputClass}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className={inputClass}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="Confirm new password"
                  className={inputClass}
                />
              </div>

              {state.error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <button
                  onClick={handleReset}
                  disabled={state.loading}
                  className={buttonClass}
                >
                  {state.loading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setScreen("login");
                      setState({ loading: false, error: "", success: "" });
                    }}
                    className="text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Text */}
        
      </div>
    </div>
  );
}
