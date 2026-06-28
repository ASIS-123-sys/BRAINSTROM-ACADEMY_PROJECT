"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, sendOTP, verifyOTPAndReset } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [screen, setScreen] = useState<"login" | "forgot" | "otp">("login");

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleLogin() {
    if (!adminId || !password) {
      setError("Please enter Admin ID and password");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await loginAdmin(adminId, password);
    setLoading(false);
    if (error) {
      setError("Invalid Admin ID or password");
    } else {
      router.push("/admin/dashboard");
    }
  }

  async function handleSendOTP() {
    if (!otpEmail) {
      setError("Please enter the preset email");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await sendOTP(otpEmail);
    setLoading(false);
    if (error) {
      setError("Could not send OTP. Check the email and try again.");
    } else {
      setSuccess("OTP sent to preset email");
      setScreen("otp");
    }
  }

  async function handleReset() {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await verifyOTPAndReset(otpEmail, otp, newPassword);
    setLoading(false);
    if (error) {
      setError("Invalid OTP or expired. Try again.");
    } else {
      setSuccess("Password reset successfully");
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
            placeholder="Password"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            onClick={() => {
              setScreen("forgot");
              setError("");
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
          <p>OTP will be sent to the preset number email</p>

          <input
            type="email"
            value={otpEmail}
            onChange={(e) => setOtpEmail(e.target.value)}
            placeholder="Enter preset email"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            onClick={() => {
              setScreen("login");
              setError("");
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
          <p style={{ color: "green" }}>{success}</p>

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
            placeholder="Confirm new password"
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 8,
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            style={{ width: "100%", padding: 10 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
}
