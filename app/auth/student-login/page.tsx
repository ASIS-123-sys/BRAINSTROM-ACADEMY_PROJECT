"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginStudent,
  sendOTP,
  verifyOTPAndReset,
  getCurrentUser,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase";

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

  // skip login page if already logged in
  useEffect(() => {
    getCurrentUser().then(({ user }) => {
      if (user) router.push("/student/dashboard");
    });
  }, []);

  async function handleLogin() {
    if (!enrollmentId || !password) {
      setState({
        loading: false,
        error: "Please enter your Enrollment ID and password",
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

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      {/* LOGIN SCREEN */}
      {screen === "login" && (
        <div>
          <h1>Student Login</h1>

          <input
            type="text"
            value={enrollmentId}
            onChange={(e) => setEnrollmentId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enrollment ID"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {state.error && <p style={{ color: "red" }}>{state.error}</p>}
          {state.success && <p style={{ color: "green" }}>{state.success}</p>}

          <button
            onClick={handleLogin}
            disabled={state.loading}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            {state.loading ? "Logging in..." : "Login"}
          </button>

          <button
            onClick={() => {
              setScreen("forgot");
              setState({ loading: false, error: "", success: "" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </button>
        </div>
      )}

      {/* FORGOT PASSWORD SCREEN */}
      {screen === "forgot" && (
        <div>
          <h1>Forgot Password</h1>
          <p>Enter your registered email to receive an OTP</p>

          <input
            type="email"
            value={otpEmail}
            onChange={(e) => setOtpEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
            placeholder="Enter your email"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {state.error && <p style={{ color: "red" }}>{state.error}</p>}

          <button
            onClick={handleSendOTP}
            disabled={state.loading}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            {state.loading ? "Sending..." : "Send OTP"}
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

      {/* OTP SCREEN */}
      {screen === "otp" && (
        <div>
          <h1>Enter OTP</h1>
          {state.success && <p style={{ color: "green" }}>{state.success}</p>}

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP from email"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            placeholder="Confirm new password"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {state.error && <p style={{ color: "red" }}>{state.error}</p>}

          <button
            onClick={handleReset}
            disabled={state.loading}
            style={{ width: "100%", padding: 10 }}
          >
            {state.loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
}
