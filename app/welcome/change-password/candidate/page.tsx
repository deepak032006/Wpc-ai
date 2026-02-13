"use client";

import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CgLock } from "react-icons/cg";
import { reset_password } from "@/app/action/verify.action";
import { usePasswordReset } from "@/context/VerificationContext";

export default function ChangePassword() {
  const router = useRouter();
  const { resetData, clearResetData } = usePasswordReset();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requireLogin, setRequireLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetData?.email || !resetData?.token || !resetData?.code) {
      toast.error("Invalid or expired reset session");
      router.replace("/welcome/verify");
    }
  }, [resetData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!resetData) return;

    setLoading(true);

    const res = await reset_password({
      email: resetData.email,
      token: resetData.token,
      code: resetData.code,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push('/auth/candidate/login')
  };

  return (
    <div className="w-full max-w-[540px] bg-white rounded-[14px] shadow-[0_12px_40px_rgba(14,58,128,0.12)] px-8.75 py-10 mx-auto mt-20">
      <Logo className="object-contain h-40 w-48.75 mb-4" fontSize={20} />

      <div className="text-center mb-8">
        <h1 className="text-[24px] lg:text-[26px] 2xl:text-[30px] font-semibold">
          Choose a new password
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* New Password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-[#111111] font-medium text-[15px] lg:text-[17px]">
            New password
          </label>

          <div className="relative w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="..........."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-2 border-[#D0D5DD] rounded-[9px] px-4 py-3.5 pl-10 focus:outline-0 focus:ring-2 focus:ring-[#0852C9]/90"
              required
            />
            <CgLock className="absolute top-4 left-3" size={20} />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-4 right-3"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-[#111111] font-medium text-[15px] lg:text-[17px]">
            Re-type New password
          </label>

          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="..........."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-[#D0D5DD] rounded-[9px] px-4 py-3.5 pl-10 focus:outline-0 focus:ring-2 focus:ring-[#0852C9]/90"
              required
            />
            <CgLock className="absolute top-4 left-3" size={20} />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute top-4 right-3"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Require Login */}
        <label className="flex items-center gap-3 text-[15px] text-[#1E1D1D] font-medium">
          <input
            type="checkbox"
            checked={requireLogin}
            onChange={() => setRequireLogin(!requireLogin)}
            className="w-5 h-5 accent-[#0852C9]"
          />
          Require to sign in with new password
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0852C9] text-white px-4 py-3.5 rounded-[9px] font-semibold hover:bg-[#0852C9]/90 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
