"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "email" | "code" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
         },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Code sent to your email!", isError: false });
        setStep("code");
      } else {
        setMessage({ text: data.error || "Something went wrong!", isError: true });
      }
    } catch {
      setMessage({ text: "We had problems connecting to the server!", isError: true });
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Code verified!", isError: false });
        setStep("password");
      } else {
        setMessage({ text: data.message || "Invalid code!", isError: true });
      }
    } catch {
      setMessage({ text: "We had problems connecting to the server!", isError: true });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", isError: true });
      return;
    }
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Password changed successfully!", isError: false });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage({ text: data.error || "Something went wrong!", isError: true });
      }
    } catch {
      setMessage({ text: "We had problems connecting to the server!", isError: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-200 md:max-w-md">
        
        <h1 className="font-[family-name:var(--font-js)] font-bold text-4xl mb-2 tracking-tighter text-black uppercase">
          {step === "email" && "Forgot Password"}
          {step === "code" && "Verify Code"}
          {step === "password" && "New Password"}
        </h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 mt-2">
          {(["email", "code", "password"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                step === s ? "bg-black scale-125" : 
                (["email", "code", "password"].indexOf(step) > i ? "bg-black" : "bg-gray-300")
              }`} />
              {i < 2 && <div className={`w-8 h-[1px] transition-all duration-300 ${
                ["email", "code", "password"].indexOf(step) > i ? "bg-black" : "bg-gray-300"
              }`} />}
            </div>
          ))}
        </div>

        {message.text && (
          <div className={`w-full p-3 mb-6 rounded-xl text-sm font-medium text-center border ${
            message.isError
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-green-50 text-green-600 border-green-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full space-y-4 mb-6">
          {step === "email" && (
            <>
              <p className="text-sm text-gray-500 text-center mb-4">
                Enter your email and we'll send you a verification code.
              </p>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </>
          )}

          {step === "code" && (
            <>
              <p className="text-sm text-gray-500 text-center mb-4">
                Enter the 6-digit code sent to <span className="font-semibold text-black">{email}</span>
              </p>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Verification Code
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all tracking-[0.5em] text-center font-bold"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </label>
            </>
          )}

          {step === "password" && (
            <>
              <p className="text-sm text-gray-500 text-center mb-4">
                Choose a new password for your account.
              </p>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                New Password
                <input
                  type="password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Confirm Password
                <input
                  type="password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </>
          )}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={step === "email" ? handleSendCode : step === "code" ? handleVerifyCode : handleResetPassword}
          className="w-full bg-black text-white font-bold py-3 rounded-xl mb-4 hover:-translate-y-1 transition-transform active:scale-95 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? "Loading..." : step === "email" ? "Send Code" : step === "code" ? "Verify Code" : "Reset Password"}
        </button>

        {step !== "email" && (
          <button
            type="button"
            onClick={() => {
              setStep(step === "code" ? "email" : "code");
              setMessage({ text: "", isError: false });
            }}
            className="text-xs font-semibold text-gray-500 uppercase hover:text-black transition-colors duration-150"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}