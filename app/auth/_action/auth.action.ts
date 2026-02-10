"use server";

import { cookies } from "next/headers";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://wpcapitest.careerbandhu.in/";

type AuthResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    role: string;
    onboarding: boolean;
  };
};

type ActionResult = {
  success: boolean;
  message: string;
  data: AuthResponse["user"] | null;
};

const setCookies = async (data: AuthResponse) => {
  const cookieStore = await cookies();

  cookieStore.set("access-token", data.access, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 hour
  });

  cookieStore.set("refresh-token", data.refresh, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  cookieStore.set("user-info", JSON.stringify(data.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

const getFirstError = (errorData: any): string => {
  // Priority order for checking errors
  const fields = [
    "email",
    "password",
    "password1",
    "password2",
    "role",
    "non_field_errors",
    "detail",
    "message",
  ];

  for (const field of fields) {
    if (errorData[field]) {
      const error = Array.isArray(errorData[field])
        ? errorData[field][0]
        : errorData[field];
      return typeof error === "string" ? error : JSON.stringify(error);
    }
  }

  // If no specific field error found, check if errorData itself is a string
  if (typeof errorData === "string") {
    return errorData;
  }

  return "An error occurred. Please try again.";
};

const formatErrorMessage = (error: string, isLogin: boolean = false): string => {
  // Common error mappings
  const errorMap: Record<string, string> = {
    "This field is required.": "Please fill in all required fields.",
    "Email already exists.": "This email is already registered. Try logging in instead.",
    "user with this email already exists.": "This email is already registered. Try logging in instead.",
    "A user with that email already exists.": "This email is already registered. Try logging in instead.",
    "Invalid credentials.": "Invalid email or password. Please try again.",
    "No active account found with the given credentials.": "Invalid email or password. Please try again.",
    "Unable to log in with provided credentials.": "Invalid email or password. Please try again.",
    "This field may not be blank.": "Please fill in all required fields.",
    "Enter a valid email address.": "Please enter a valid email address.",
    "This password is too short. It must contain at least 8 characters.": "Password must be at least 8 characters long.",
    "This password is too common.": "Please choose a stronger password.",
    "This password is entirely numeric.": "Password cannot be entirely numeric.",
  };

  // Normalize error for comparison
  const normalizedError = error.trim();

  // Check for role validation errors
  if (
    normalizedError.includes("not a valid choice") ||
    normalizedError.includes("valid choice") ||
    normalizedError.toLowerCase().includes("invalid role")
  ) {
    return "Please select a valid role (student or teacher).";
  }

  // Check for password validation
  if (normalizedError.toLowerCase().includes("password")) {
    if (normalizedError.includes("too short") || normalizedError.includes("at least")) {
      return "Password must be at least 8 characters long.";
    }
    if (normalizedError.includes("too common")) {
      return "Please choose a stronger password.";
    }
    if (normalizedError.includes("entirely numeric")) {
      return "Password cannot be entirely numeric.";
    }
    if (normalizedError.includes("too similar")) {
      return "Password is too similar to your email.";
    }
  }

  // Check for email validation
  if (normalizedError.toLowerCase().includes("email")) {
    if (normalizedError.includes("valid email") || normalizedError.includes("Enter a valid")) {
      return "Please enter a valid email address.";
    }
  }

  // Return mapped error or original
  return errorMap[normalizedError] || error;
};

export async function loginAction(payload: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_URL}api/auth/login/`,
      payload,
      {
        timeout: 15000, // 15 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await setCookies(data);

    return {
      success: true,
      message: "Login successful! Redirecting...",
      data: data.user,
    };
  } catch (error: any) {
    // Log error for debugging (server-side only)
    console.error("Login error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });

    // API returned an error response (4xx, 5xx)
    if (error.response?.data) {
      const errorMessage = getFirstError(error.response.data);
      return {
        success: false,
        message: formatErrorMessage(errorMessage, true),
        data: null,
      };
    }

    // Network errors (request made but no response)
    if (error.request) {
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return {
          success: false,
          message: "Request timed out. Please try again.",
          data: null,
        };
      }

      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: false,
          message: "Unable to reach the server. Please check your internet connection.",
          data: null,
        };
      }

      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: null,
      };
    }

    // Something else happened (error in setting up request)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: null,
    };
  }
}

export async function signupAction(payload: {
  email: string;
  password: string;
  role: string;
}): Promise<ActionResult> {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_URL}api/auth/register/`,
      payload,
      {
        timeout: 15000, // 15 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await setCookies(data);

    return {
      success: true,
      message: "Account created successfully! Welcome aboard.",
      data: data.user,
    };
  } catch (error: any) {
    // Log error for debugging (server-side only)
    console.error("Signup error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });

    // API returned an error response (4xx, 5xx)
    if (error.response?.data) {
      const errorMessage = getFirstError(error.response.data);
      return {
        success: false,
        message: formatErrorMessage(errorMessage, false),
        data: null,
      };
    }

    // Network errors (request made but no response)
    if (error.request) {
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return {
          success: false,
          message: "Request timed out. Please try again.",
          data: null,
        };
      }

      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: false,
          message: "Unable to reach the server. Please check your internet connection.",
          data: null,
        };
      }

      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: null,
      };
    }

    // Something else happened (error in setting up request)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: null,
    };
  }
}



// update userifno
export async function update_User_info() {
  try {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get("user-info")?.value;

    if (!userInfoCookie) {
      return {
        success: false,
        message: "User info not found",
      };
    }

    const userInfo = JSON.parse(userInfoCookie);

    const updatedUserInfo = {
      ...userInfo,
      onboarding: true,
    };

    cookieStore.set("user-info", JSON.stringify(updatedUserInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return {
      success: true,
      message: "Onboarding completed successfully",
      data: updatedUserInfo,
    };
  } catch (error) {
    console.error("Error updating user info:", error);
    return {
      success: false,
      message: "Failed to update user info",
    };
  }
}