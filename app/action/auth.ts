"use server";

import z from "zod";
import { loginFormSchema, signUpFormSchema } from "@/lib/definitions";

export async function handleEmailLogin(prev: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const lastName = formData.get("lastName");

  const validatedFields = loginFormSchema.safeParse({ email, password, lastName });

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten());
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
     const res = await fetch("http://placeholder", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(validatedFields.data),
     });

     if (!res.ok) {
       throw new Error("Login failed");
     }

     const data = await res.json();
     console.log("Login successful:", data);
  }catch(error){
    console.error("Error during login:", error);
  }
}

export async function handleRegister(prev: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validatedFields = signUpFormSchema.safeParse({ email, password, confirmPassword });

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten());
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  try {
     const res = await fetch("http://placeholder", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(validatedFields.data),
     });

     if (!res.ok) {
       throw new Error("Login failed");
     }

     const data = await res.json();
     console.log("Login successful:", data);
  }catch(error){
    console.error("Error during login:", error);
  }
}

export async function handleProviderLogin(provider: string) {}
