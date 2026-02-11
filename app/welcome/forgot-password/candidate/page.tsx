"use client";

import { get_verification_token, verify_email } from "@/app/action/verify.action";
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CgLock } from "react-icons/cg";
import { usePasswordReset } from "@/context/VerificationContext";

export default function VerifyCode() {
  const router = useRouter();
  const { setResetData } = usePasswordReset();

  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(25);
  const [loading, setLoading] = useState(false);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (step !== "verify" || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

  /* ---------------- SEND OTP ---------------- */
  const handleSendCode = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    const res = await get_verification_token(email);
    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Verification Code Sent on mail");
    setStep("verify");
    setTimer(25);
  };

  /* ---------------- OTP INPUT ---------------- */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);
    const res = await verify_email({ email, otp: otpCode });
    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    setResetData({
      email,
      token: res.token,
      code: res.code,
    });

    toast.success("OTP verified successfully");
    router.push("/welcome/change-password/candidate");
  };

  /* ---------------- RESEND CODE ---------------- */
  const handleResendCode = async () => {
    setOtp(Array(6).fill(""));
    setTimer(25);
    await handleSendCode();
  };

  /* ---------------- UI ---------------- */

  if (step === "email") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <Logo className="object-contain h-16 w-auto mb-4 mx-auto" fontSize={16} />

          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold">
              Enter your email
            </h1>
            <p className="text-[#4D4D4D] text-sm mt-1">
              We'll send you a verification code
            </p>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-[#989898] rounded-md px-4 py-2.5 mb-4 text-sm"
          />

          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full bg-[#0852C9] text-white px-4 py-2.5 rounded-md font-semibold text-sm"
          >
            {loading ? "Sending..." : "Send Code"}
          </button>

          <div className="flex justify-center items-center gap-2 mt-4 text-[#454242] text-xs">
            <CgLock size={14} />
            <span>Your information is securely encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <Logo className="object-contain h-16 w-auto mb-4 mx-auto" fontSize={16} />

        <div className="text-center mb-5">
          <h1 className="text-xl font-semibold">
            Enter your code
          </h1>
          <p className="text-[#4D4D4D] text-sm mt-1">
            Check <span className="font-medium">{email}</span> for a verification code
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-3">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-11 h-11 border-2 border-[#D1D5DB] rounded-md text-center text-lg font-semibold focus:border-[#0852C9] focus:outline-none"
            />
          ))}
        </div>

        <p className="text-[#0852C9] text-xs mb-4 text-left">
          Resend code in {timer}s
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#0852C9] text-white px-4 py-2.5 rounded-md font-semibold text-sm mb-3 hover:bg-[#0642a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResendCode}
          disabled={loading || timer > 0}
          className="w-full border-2 border-[#0852C9] text-[#0852C9] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#0852C9] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resend Code
        </button>

        <div className="flex justify-center items-center gap-2 mt-4 text-[#454242] text-xs">
          <CgLock size={14} />
          <span>Your information is securely encrypted</span>
        </div>
      </div>
    </div>
  );
}