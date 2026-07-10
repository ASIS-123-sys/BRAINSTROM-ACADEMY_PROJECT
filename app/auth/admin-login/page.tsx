"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, sendOTP, verifyOTPAndReset } from "@/lib/auth";
import { createClient } from "@/lib/supabase";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// pre-warms the connection
const supabase = createClient();
supabase.auth.getSession();

export default function AdminLoginPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"login" | "forgot" | "otp">("login");

  const [adminId, setAdminId] = useState("");
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
    if (!adminId || !password) {
      setState({
        loading: false,
        error: "Please enter Admin ID and password",
        success: "",
      });
      return;
    }
    setState({ loading: true, error: "", success: "" });
    const { error } = await loginAdmin(adminId, password);
    if (error) {
      setState({
        loading: false,
        error: "Invalid Admin ID or password",
        success: "",
      });
    } else {
      router.push("/admin/dashboard");
    }
  }

  async function handleSendOTP() {
    // hardcoded admin email — OTP always goes here
    const ADMIN_EMAIL = "asisdas1994@gmail.com";

    setState({ loading: true, error: "", success: "" });
    const { error } = await sendOTP(ADMIN_EMAIL);
    if (error) {
      setState({
        loading: false,
        error: "Could not send OTP. Try again.",
        success: "",
      });
    } else {
      setOtpEmail(ADMIN_EMAIL);
      setState({
        loading: false,
        error: "",
        success: "OTP sent to admin email",
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
        success: "Password reset successfully.",
      });
      setScreen("login");
    }
  }

  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  const inputClass =
    "w-full bg-[#0F172A]/60 text-[#F8FAFC] placeholder-[#94A3B8] border border-white/10 px-4 py-3 rounded-xl focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] outline-none transition-all duration-300 text-sm";
  const buttonClass =
    "w-full py-3 rounded-xl font-bold bg-[#06B6D4] text-[#0F172A] hover:bg-[#06B6D4]/90 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed";
  const linkClass =
    "text-[#F59E0B] hover:underline font-medium text-sm transition-all duration-300 block text-center w-full mt-4 bg-transparent border-none cursor-pointer";

  return (
    <div
      className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] flex items-center justify-center relative overflow-hidden px-6 ${poppins.className}`}
    >
      {/* Decorative Blur Circles */}
      <div className="w-[500px] h-[500px] bg-[#06B6D4]/10 blur-[120px] rounded-full absolute -top-40 -right-40 pointer-events-none -z-10" />
      <div className="w-[500px] h-[500px] bg-[#3B82F6]/10 blur-[120px] rounded-full absolute -bottom-40 -left-40 pointer-events-none -z-10" />

      {/* Main Login Card */}
      <div
        style={glassCardStyle}
        className="w-full max-w-[420px] p-8 md:p-10 flex flex-col relative z-10 hover:border-white/15 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500"
      >
        {/* Top of Card Lock Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4] mb-4">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {screen === "login" && (
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-[#F8FAFC]">
              Admin Login
            </h1>
            <p className="text-xs md:text-sm text-center text-[#94A3B8] mt-1 mb-8">
              Restricted access only
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Admin ID"
                className={inputClass}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                className={inputClass}
              />
            </div>

            {state.error && (
              <p className="text-red-400 text-xs mt-3 text-center bg-red-400/10 border border-red-400/20 py-2 px-3 rounded-lg">
                {state.error}
              </p>
            )}
            {state.success && (
              <p className="text-green-400 text-xs mt-3 text-center bg-green-400/10 border border-green-400/20 py-2 px-3 rounded-lg">
                {state.success}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={state.loading}
              className={`${buttonClass} mt-6`}
            >
              {state.loading ? "Logging in..." : "Login"}
            </button>

            <button
              onClick={() => {
                setScreen("forgot");
                setState({ loading: false, error: "", success: "" });
              }}
              className={linkClass}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {screen === "forgot" && (
          <div>
            <h1>Reset Admin Password</h1>
            <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 16 }}>
              OTP will be sent to the preset admin email
            </p>

            {state.error && <p style={{ color: "red" }}>{state.error}</p>}
            {state.success && <p style={{ color: "green" }}>{state.success}</p>}

            <button
              onClick={handleSendOTP}
              disabled={state.loading}
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
            >
              {state.loading ? "Sending..." : "Send OTP to Admin Email"}
            </button>

            <button
              onClick={() => {
                setScreen("login");
                setState({ loading: false, error: "", success: "" });
              }}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        {screen === "otp" && (
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-[#F8FAFC]">
              Enter OTP
            </h1>
            <p className="text-xs md:text-sm text-center text-[#94A3B8] mt-1 mb-8">
              Verification code sent to email
            </p>

            {state.success && (
              <p className="text-green-400 text-xs mb-4 text-center bg-green-400/10 border border-green-400/20 py-2 px-3 rounded-lg">
                {state.success}
              </p>
            )}

            <div className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className={inputClass}
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
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
              <p className="text-red-400 text-xs mt-3 text-center bg-red-400/10 border border-red-400/20 py-2 px-3 rounded-lg">
                {state.error}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={state.loading}
              className={`${buttonClass} mt-6`}
            >
              {state.loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
