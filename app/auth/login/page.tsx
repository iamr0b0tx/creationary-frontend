"use client";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { handleEmailLogin, handleForgotPassword } from "@/app/action/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, OctagonAlert } from "lucide-react";
import FormErrorDisplay from "@/components/ui/form-error-display";
import { ForgotPasswordActionState, LoginActionState } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginState, loginAction, loginPending] = useActionState<LoginActionState, FormData>(
    handleEmailLogin,
    { status: "no_action", message: "" }
  );
  const [forgotPasswordState, forgotPasswordAction, forgotPasswordPending] = useActionState<
    ForgotPasswordActionState,
    FormData
  >(handleForgotPassword, { status: "no_action" });
  const [clearErrors, setClearErrors] = useState(false);
  const [pageState, setPageState] = useState<"login" | "forgot-password">("login");

  const router = useRouter();

  useEffect(() => {
    setClearErrors(false);
    setTimeout(() => {
      if (
        loginState?.errors ||
        forgotPasswordState.status == "error" ||
        forgotPasswordState.status == "invalid_email"
      ) {
        setClearErrors(true);
      }
    }, 10000);
  }, [loginState?.errors, forgotPasswordState.status]);

  useEffect(() => {
    if (loginState.status == "success") router.push("/explore");
    if (forgotPasswordState.status == "success") router.push("/auth/reset-password");
    // eslint-disable-next-line
  }, [loginState.status]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Image alt="Background" src="/bg-img.png" fill className="-z-10 h-screen object-cover" />
      <div className="absolute inset-0 -z-[5] bg-black opacity-50"></div>

      <div className="w-full max-w-md space-y-8 rounded-xl px-4 py-3 backdrop-blur-md">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-white">
            {pageState == "login" ? "Sign in to your account" : "Reset your password"}
          </h2>
        </div>

        {pageState == "login" && (
          <form action={loginAction} className="mt-8 space-y-6">
            {loginState?.errors && !clearErrors && (
              <Alert variant="destructive" className="border-red-500 bg-red-100 text-red-500">
                <OctagonAlert color="#ef4444" className="h-5 w-5 text-red-500" />
                <AlertDescription>
                  {typeof loginState.errors === "string" ? (
                    <div className="text-sm">{loginState.errors}</div>
                  ) : (
                    Object.entries(loginState.errors).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <strong>{key}:</strong>
                        <ul className="">
                          {String(value.errors ?? "")
                            .split(",")
                            .map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                        </ul>
                      </div>
                    ))
                  )}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-4 rounded-md">
              <div>
                <Input
                  type="email"
                  name="email"
                  required
                  className="relative block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="relative block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginPending}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {loginPending ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  disabled={true}
                  // onClick={() => handleProviderLogin("google")}
                  formAction={() => {}}
                  className="inline-flex w-full justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100 disabled:opacity-40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>

                <Button
                  disabled={true}
                  formAction={() => {}}
                  className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-600 hover:to-pink-600 disabled:opacity-40"
                >
                  <InstagramLogo />
                  <span className="ml-2">Instagram</span>
                </Button>
              </div>
            </div>
          </form>
        )}
        {pageState == "forgot-password" && (
          <form action={forgotPasswordAction} className="mt-8 space-y-6">
            {forgotPasswordState.status == "error" && !clearErrors && (
              <FormErrorDisplay message="An error occurred. Please try again." />
            )}
            {forgotPasswordState.status == "invalid_email" && !clearErrors && (
              <FormErrorDisplay message="Please enter a valid email address." />
            )}
            {forgotPasswordState.status == "success" && (
              <Alert className="border-green-500 bg-green-100 text-green-500">
                Password reset link sent successfully!
              </Alert>
            )}
            <div className="space-y-4 rounded-md">
              <div>
                <Input
                  type="email"
                  name="email"
                  required
                  className="relative block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <Button
                disabled={forgotPasswordPending}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {forgotPasswordPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}
        <div className="flex justify-between py-2">
          <span
            role="button"
            className={`cursor-pointer text-xs text-indigo-200 underline hover:text-indigo-500`}
            onClick={() =>
              setPageState((c) => (c == "forgot-password" ? "login" : "forgot-password"))
            }
          >
            {pageState === "forgot-password" ? "Back to Login?" : "Forgot Password?"}
          </span>
          <Link
            className="text-xs text-indigo-200 underline hover:text-indigo-500"
            href="/auth/signup"
          >
            Don&apos;t have an account yet?
          </Link>
        </div>
      </div>
    </div>
  );
}

const InstagramLogo = () => (
  <svg
    width="800px"
    className="h-5 w-5"
    height="800px"
    viewBox="0 0 2500 2500"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="0" cx="332.14" cy="2511.81" r="3263.54" gradientUnits="userSpaceOnUse">
        <stop offset=".09" stopColor="#fa8f21" />
        <stop offset=".78" stopColor="#d82d7e" />
      </radialGradient>
      <radialGradient id="1" cx="1516.14" cy="2623.81" r="2572.12" gradientUnits="userSpaceOnUse">
        <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0" />
        <stop offset="1" stopColor="#8c3aaa" />
      </radialGradient>
    </defs>
    <path
      d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57"
      fill="url(#0)"
    />
    <path
      d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57"
      fill="url(#1)"
    />
  </svg>
);
