"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginStudent, sendOTP, verifyOTPAndReset } from "@/lib/auth";

export default function StudentLoginPage() {
  const router = useRouter();

  // which screen to show
  const [screen, setScreen] = useState<"login" | "forgot" | "otp" | "reset">(
    "login",
  );

  // login fields
  const [enrollmentId, setEnrollmentId] = useState("");
  const [password, setPassword] = useState("");

  // forgot password fields
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // feedback
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // --- LOGIN ---
  async function handleLogin() {
    if (!enrollmentId || !password) {
      setError("Please enter your Enrollment ID and password");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await loginStudent(enrollmentId, password);
    setLoading(false);
    if (error) {
      setError("Invalid Enrollment ID or password");
    } else {
      router.push("/student/dashboard");
    }
  }

  // --- SEND OTP ---
  async function handleSendOTP() {
    if (!otpEmail) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await sendOTP(otpEmail);
    setLoading(false);
    if (error) {
      setError("Could not send OTP. Check your email and try again.");
    } else {
      setSuccess("OTP sent to your email");
      setScreen("otp");
    }
  }

  // --- VERIFY OTP AND RESET ---
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
      setError("Invalid OTP or it has expired. Try again.");
    } else {
      setSuccess("Password reset successfully. Please log in.");
      setScreen("login");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      {/* LOGIN SCREEN */}
      {screen === "login" && (
        <div>
          <h1>Student Login</h1>

          <div>
            <label>Enrollment ID</label>
            <input
              type="text"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              placeholder="Enter your Enrollment ID"
              style={{
                display: "block",
                width: "100%",
                marginBottom: 12,
                padding: 8,
              }}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                display: "block",
                width: "100%",
                marginBottom: 12,
                padding: 8,
              }}
            />
          </div>

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
              setSuccess("");
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
            placeholder="Enter your email"
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

      {/* OTP VERIFICATION SCREEN */}
      {screen === "otp" && (
        <div>
          <h1>Enter OTP</h1>
          <p style={{ color: "green" }}>{success}</p>

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
