"use server";

import z from "zod";
import { loginFormSchema, signUpFormSchema } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import logger from "@/lib/serverLogger";
import { ForgotPasswordActionState, ResetPasswordActionState } from "@/lib/types/types";

export async function handleEmailLogin(prev: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/login`, {
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
    createCookie("token", responseData.token, { httpOnly: true, path: "/" });
    createCookie("user", JSON.stringify({ ...responseData.user }), {
      httpOnly: false,
      path: "/",
    });
  } catch (error) {
    logger.error("Error during login:", error);
  }
  redirect("/dashboard");
}

export async function handleRegister(prev: unknown, formData: FormData) {
  const email = formData.get("email");
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
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/signup`, {
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
    createCookie("token", responseData.token, { httpOnly: true, path: "/" });
    createCookie("user", JSON.stringify({ ...responseData.user }), {
      httpOnly: false,
      path: "/",
    });
  } catch (error) {
    logger.error("Error during login:", error);
  }
  redirect("/dashboard");
}

export async function handleProviderLogin(_provider: string) {}

export async function getSession() {
  try {
    const user = (await cookies()).get("user")?.value;

    if (!user) redirect("/auth");

    const userInfo = JSON.parse(user);
    return userInfo;
  } catch (_error) {
    redirect("/auth");
  }
}

export async function handlePasswordReset(_: ResetPasswordActionState, formData: FormData): Promise<ResetPasswordActionState> {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return { status: "password_mismatch" };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/reset-password`, {
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

export async function handleForgotPassword(_: ForgotPasswordActionState, formData: FormData): Promise<ForgotPasswordActionState> {
  const validatedFields = z.object({
    email: z.email(),
  }).safeParse({ email: formData.get("email") });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { status: "invalid_email" };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/forgot-password`, {
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

async function createCookie(
  name: string,
  value: string,
  options: { httpOnly?: boolean; path?: string } = {}
) {
  (await cookies()).set({
    name,
    value: value,
    httpOnly: options.httpOnly || false,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
