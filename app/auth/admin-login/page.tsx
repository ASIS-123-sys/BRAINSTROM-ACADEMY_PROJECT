"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, sendOTP, verifyOTPAndReset } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

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
    if (!otpEmail) {
      setState({
        loading: false,
        error: "Please enter the preset email",
        success: "",
      });
      return;
    }
    setState({ loading: true, error: "", success: "" });
    const { error } = await sendOTP(otpEmail);
    if (error) {
      setState({
        loading: false,
        error: "Could not send OTP. Try again.",
        success: "",
      });
    } else {
      setState({
        loading: false,
        error: "",
        success: "OTP sent to preset email",
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

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      {screen === "login" && (
        <div>
          <h1>Admin Login</h1>

          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin ID"
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

      {screen === "forgot" && (
        <div>
          <h1>Reset Admin Password</h1>
          <p>OTP will be sent to the preset email</p>

          <input
            type="email"
            value={otpEmail}
            onChange={(e) => setOtpEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
            placeholder="Enter preset email"
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

      {screen === "otp" && (
        <div>
          <h1>Enter OTP</h1>
          {state.success && <p style={{ color: "green" }}>{state.success}</p>}

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
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
