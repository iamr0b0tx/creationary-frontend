"use client";
import { useActionState, useEffect, useState } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { handlePasswordReset } from "@/app/action/auth";
import { Loader2 } from "lucide-react";
import { ResetPasswordActionState } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import FormErrorDisplay from "@/components/ui/form-error-display";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, loginAction, loginPending] = useActionState<ResetPasswordActionState, FormData>(
    handlePasswordReset,
    { status: "no_action" }
  );

  const router = useRouter();
  useEffect(() => {
    if (state.status === "success") {
      router.push("/auth/login");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Image alt="Background" src="/bg-img.png" fill className="-z-10 h-screen object-cover" />
      <div className="absolute inset-0 -z-[5] bg-black opacity-50"></div>

      <div className="w-full max-w-md space-y-8 rounded-xl px-4 py-3 backdrop-blur-md">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-white">Reset Password</h2>
        </div>

        <form action={loginAction} className="mt-8 space-y-6">
          {state.status == "password_mismatch" && (
            <FormErrorDisplay message="Passwords do not match." />
          )}
          {state.status == "error" && (
            <FormErrorDisplay message="An error occurred. Please try again." />
          )}
          <div className="space-y-4 rounded-md">
            <div>
              <Input
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginPending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {loginPending ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
