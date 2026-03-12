// actions/verify.action.ts

import axios from "axios";

/* =======================================================
   SEND OTP (FORGOT PASSWORD)
======================================================= */

type OtpResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export async function request_password_reset(
  email: string
): Promise<OtpResponse> {

  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {

    const res = await axios.post(
      "/api/proxy/accounts/password-reset/",
      {
        email
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        message: res.data?.message || "OTP sent successfully",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };

  } catch (error: any) {

    return {
      success: false,
      message:
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.detail ||
        "Failed to send reset email",
    };

  }
}


/* =======================================================
   VERIFY OTP
======================================================= */

type VerifyEmailPayload = {
  email: string;
  otp: string;
};

type VerifyEmailResponse =
  | {
      success: true;
      message: string;
      token: string;
      code: string;
    }
  | {
      success: false;
      message: string;
    };

export async function verify_email(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {

  const { email, otp } = payload;

  if (!email || !otp) {
    return {
      success: false,
      message: "Email and OTP are required",
    };
  }

  try {

    const res = await axios.post(
      "/api/proxy/api/auth/password/verify-otp/",
      {
        email,
        otp
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        message: res.data?.message || "OTP verified",
        token: res.data.token,
        code: res.data.code,
      };
    }

    return {
      success: false,
      message: "Verification failed",
    };

  } catch (error: any) {

    if (error?.response?.data?.email?.[0]) {
      return {
        success: false,
        message: error.response.data.email[0],
      };
    }

    if (error?.response?.data?.otp?.[0]) {
      return {
        success: false,
        message: error.response.data.otp[0],
      };
    }

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        "OTP verification failed",
    };

  }
}


/* =======================================================
   RESET PASSWORD
======================================================= */

type ResetPasswordPayload = {
  email: string;
  token: string;
  code: string;
  new_password: string;
  confirm_password: string;
};

type ResetPasswordResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export async function reset_password(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {

  const {
    email,
    token,
    code,
    new_password,
    confirm_password
  } = payload;

  if (!email || !token || !code || !new_password || !confirm_password) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  if (new_password !== confirm_password) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  try {

    const res = await axios.post(
      "/api/proxy/api/auth/password/reset/",
      {
        email,
        token,
        code,
        new_password,
        confirm_password
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        message: res.data?.message || "Password reset successfully",
      };
    }

    return {
      success: false,
      message: "Failed to reset password",
    };

  } catch (error: any) {

    return {
      success: false,
      message:
        error?.response?.data?.new_password?.[0] ||
        error?.response?.data?.detail ||
        "Reset failed",
    };

  }
}