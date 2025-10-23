"use server";

import z from "zod";
import { loginFormSchema, signUpFormSchema } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import logger from "@/lib/serverLogger";

export async function handleEmailLogin(prev: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const lastName = formData.get("lastName");

  const validatedFields = loginFormSchema.safeParse({
    email,
    password,
    lastName,
  });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
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
  const confirmPassword = formData.get("confirmPassword");

  const validatedFields = signUpFormSchema.safeParse({
    email,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    logger.error("Validation errors:", validatedFields.error.flatten());
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/register`, {
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

export async function handleProviderLogin(provider: string) {}

export async function getSession() {
  try {
    const user = (await cookies()).get("user")?.value;

    if (!user) redirect("/auth");

    const userInfo = JSON.parse(user);
    return userInfo;
  } catch (error) {
    redirect("/auth");
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
