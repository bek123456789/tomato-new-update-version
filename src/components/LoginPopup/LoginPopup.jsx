import React, { useState } from "react";
import axios from "axios";
import "./LoginPopup.css";

const LoginPopup = ({ onClose, setIsAuthenticated, setUserData }) => {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [smsId, setSmsId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);

  const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3MzgyNTU5OTMsImlhdCI6MTczODE2OTU5MywiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.VAdPjmHSAqG2Q3eTEAbay9vQKrGA8xihWAtULCMe3Ms";
  const ENVIRONMENT_ID = "b3e95ba5-ac02-4e47-94dc-e94dc9500fe2";
  const RESOURCE_ID = "eed1c120-7df1-4786-9fde-3a904ea91957";
  const PROJECT_ID = "309a9c3a-8cbe-4764-a61f-cc9699746b44";

  const sendCode = async () => {
    if (!phone) {
      setError("Phone number is required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://api.auth.u-code.io/v2/auth/send-code?project_id=${PROJECT_ID}`,
        {
          recipient: phone,
          text: "Tomato project created by Bekzod and you verification code",
          type: "PHONE",
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );

      setLoading(false);
      if (response.data.status === "CREATED") {
        alert("Verification code sent to your phone!");
        setSmsId(response.data.data.sms_id);
        setStep(2);
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Error sending verification code. Please try again.");
    }
  };

  const verifyCode = async () => {
    if (!smsId) {
      setError("SMS ID not found. Please request the code again.");
      return;
    }

    if (!otpInput) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setLoading(true);

    const data = {
      sms_id: smsId,
      phone: phone,
      client_type_id: "8f809eab-7bc3-45cb-b12a-9b7fa3931949",
      role_id: "7da481d8-c12c-42be-a918-936d15f45229",
      otp: otpInput,
    };

    const postData = {
      data,
      login_strategy: "PHONE_OTP",
    };

    try {
      const response = await axios.post(
        `https://api.auth.u-code.io/v2/login/with-option?project-id=${PROJECT_ID}`,
        postData,
        {
          headers: {
            "Environment-Id": ENVIRONMENT_ID,
            "Resource-Id": RESOURCE_ID,
          },
        }
      );

      setLoading(false);

      if (response.data.status === "SUCCESS" || response.data.status === "CREATED") {
        alert("Verification successful! You are logged in.");

        // Save phone number to localStorage and call setIsAuthenticated
        setIsAuthenticated(true);
        setUserData({
          phone,
          name: "User Name",
        });
        handleCloseModal();
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred while verifying the code. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setPhone("");
    setStep(1);
    setMode("login");
    setError("");
    setSmsId("");
    setOtpInput("");
    onClose();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          width: "380px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={handleCloseModal}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "22px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          &times;
        </button>

        <h1
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        {step === 1 && (
          <div>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={sendCode}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#007BFF",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s",
              }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter the OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={verifyCode}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#28A745",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s",
              }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify and Login"}
            </button>
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#333" }}>
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setMode("register")}
                style={{
                  color: "#007BFF",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Register here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setMode("login")}
                style={{
                  color: "#007BFF",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
