// actions/authActions.ts
import clientApi from "@/lib/axios";

type OtpResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export async function get_verification_token(
  email: string
): Promise<OtpResponse> {

  // basic check
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {
    const res = await clientApi.post("api/auth/password/forgot/", {
      email,
    });

    if (res.status === 200 && res.data?.message) {
      return {
        success: true,
        message: res.data.message, 
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  } catch (error: any) {
    if (error?.response?.data?.email?.[0]) {
      return {
        success: false,
        message: error.response.data.email[0],
      };
    }
    return {
      success: false,
      message: "Failed to send OTP. Please try again later.",
    };
  }
}


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
    const res = await clientApi.post(
      "/api/auth/password/verify-otp/",
      {
        email,
        otp,
      }
    );

    if (res.status === 200 && res.data?.message) {
      return {
        success: true,
        message: res.data.message, 
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
      message: "Verification failed",
    };
  }
}

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
  const { email, token, code, new_password, confirm_password } = payload;

  // basic client-side validation
  if (
    !email ||
    !token ||
    !code ||
    !new_password ||
    !confirm_password
  ) {
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
    const res = await clientApi.post(
      "api/auth/password/reset/",
      {
        email,
        token,
        code,
        new_password,
        confirm_password,
      }
    );

    if (res.status === 200 && res.data?.message) {
      return {
        success: true,
        message: res.data.message, 
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password. Please try again.",
    };
  }
}