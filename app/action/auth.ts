"use server";

import z from "zod";
import { loginFormSchema, signUpFormSchema } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import logger from "@/lib/serverLogger";
import {
  ForgotPasswordActionState,
  LoginActionState,
  ResetPasswordActionState,
} from "@/lib/types/types";
import { baseUrl } from "@/lib/baseUrl";

export async function handleEmailLogin(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { status: "error", errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const responseData = await res.json();
    logger.info("user signed in successfully", responseData);
    (await cookies()).set({
      name: "token",
      value: responseData.token,
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    (await cookies()).set({
      name: "user",
      value: JSON.stringify({ ...responseData.user }),
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return { status: "success" };
  } catch (error) {
    logger.error("Error during login:", error);
    return {
      status: "error",
      message: "message" in (error as Error) ? (error as Error).message : "Unable to Log In",
    };
  }
}

export async function handleRegister(prev: unknown, formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const validatedFields = signUpFormSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return {
      status: "error",
      errors: z.treeifyError(validatedFields.error).properties,
    };
  }

  try {
    const payload = validatedFields.data;
    logger.info("Sending signup request with payload:", payload);

    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Read the error response body for better debugging
      const errorMessage = `Signup failed (status ${res.status})`;
      const errorBody = await res.json();

      logger.error("Error during Signup:", {
        status: res.status,
        statusText: res.statusText,
        message: errorBody.message ?? errorMessage,
        url: res.url,
      });

      return {
        status: "error",
        message: errorBody?.message ?? errorMessage,
        timestamp: Date.now(), // Force React to see this as a new error
      };
    }

    const responseData = await res.json();
    logger.info("User registered successfully:", responseData);

    // Set user cookie
    (await cookies()).set({
      name: "user",
      value: JSON.stringify({ ...responseData.user }),
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return { status: "success" };
  } catch (error: unknown) {
    logger.error("Network error during Signup:", error);
    return {
      status: "error",
      message:
        "message" in (error as Error) ? (error as Error).message : "Network error during signup",
      timestamp: Date.now(), // Force React to see this as a new error
    };
  }
}

export async function handleLogout() {
  (await cookies()).delete("token");
  (await cookies()).delete("user");
  redirect("/auth/login");
}

export async function handleProviderLogin(_provider: string) {}

export async function getSession() {
  try {
    const user = (await cookies()).get("user")?.value;

    if (!user) redirect("/auth/login");

    const userInfo = JSON.parse(user);
    return userInfo;
  } catch (_error) {
    redirect("/auth/login");
  }
}

export async function handlePasswordReset(
  token: string,
  _: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return { status: "password_mismatch" };
  }

  try {
    const res = await fetch(`${baseUrl}/auth/reset-password?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      throw new Error("Password reset failed");
    }

    await res.json();

    return { status: "success" };
  } catch (error) {
    logger.error("Error during password reset:", error);
    return { status: "error" };
  }
}

export async function handleForgotPassword(
  _: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const validatedFields = z
    .object({
      email: z.email(),
    })
    .safeParse({ email: formData.get("email") });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { status: "invalid_email" };
  }

  try {
    const res = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: validatedFields.data.email }),
    });

    if (!res.ok) {
      throw new Error("Forgot password request failed");
    }

    await res.json();

    return { status: "success" };
  } catch (error) {
    logger.error("Error during forgot password request:", error);
    return { status: "error" };
  }
}
