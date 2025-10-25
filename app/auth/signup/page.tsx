"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Eye, EyeOff, Mail, Lock, Check } from "lucide-react";
import Image from "next/image";
import { handleRegister } from "@/app/action/auth";

const SignUpCarouselContent = [
  {
    title: "Learn from the best",
    description:
      "Access high-quality courses created by industry experts and passionate educators.",
    icon: "BookOpen",
  },
  {
    title: "Share your knowledge",
    description: "Become a creator and share your expertise with a global audience.",
    icon: "Video",
  },
  {
    title: "Flexible learning",
    description: "Learn at your own pace with our on-demand courses and resources.",
    icon: "Clock",
  },
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [contentToDisplay, setContentToDisplay] = useState(0);
  const [actionState, action, actionPending] = useActionState(handleRegister, undefined);
  const [displayErrors, setDisplayErrors] = useState(false);

  const actionStateErrors = actionState?.errors || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trim(),
    }));
  };

  useEffect(() => {
    if (actionState?.errors) {
      setDisplayErrors(true);
      const interval = setTimeout(() => {
        setDisplayErrors(false);
      }, 3000);

      return () => clearTimeout(interval);
    }
  }, [actionState?.errors]);

  useEffect(() => {
    const interval = setInterval(() => {
      setContentToDisplay((prev) => (prev + 1) % SignUpCarouselContent.length);
    }, 5000); // Change content every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // router.push("/explore");

  return (
    <div className="mx-auto flex max-h-screen justify-center py-12 sm:mx-20 lg:mx-36">
      <Image alt="Background" src="/bg-img.png" fill className="-z-10 h-screen object-cover" />
      <div className="absolute inset-0 -z-[5] bg-black opacity-50"></div>
      {/* Header */}
      <div className="absolute top-0 right-0 left-0 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Play className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-white">Creationary</span>
          </Link>
        </div>
      </div>

      <div className="z-10 grid w-full grid-cols-2">
        <div className="relative mr-10 ml-14 flex w-full flex-col justify-center gap-[9rem]">
          <div className="flex items-center gap-8">
            <div className="bg-primary flex h-20 w-24 items-center justify-center rounded-xl">
              <Play className="text-primary-foreground h-8 w-8" />
            </div>
            <span className="text-4xl font-bold text-white">Creationary</span>
          </div>
          <div className="h-32 w-[calc(100%-3.5rem)] overflow-hidden">
            <div
              style={{
                transform: `translateX(-${contentToDisplay * 100}%)`,
              }}
              className="flex transition-transform duration-500 ease-in-out"
            >
              {SignUpCarouselContent.map((item, index) => (
                <div
                  key={index}
                  className="mb-6 w-full flex-shrink-0 flex-wrap text-left text-wrap"
                >
                  <h2 className="text-4xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 w-full text-lg text-wrap text-white">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-[100px] flex gap-4">
            {SignUpCarouselContent.map((item, index) => (
              <div
                className={`h-1 w-[4rem] ${
                  contentToDisplay === index ? "bg-white" : "bg-white/40"
                }`}
                key={index}
              ></div>
            ))}
          </div>
        </div>
        <Card className="max-h-screen max-w-md border-0 shadow-none">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-2xl font-bold">Join Creationary</CardTitle>
            <CardDescription className="text-sm">
              Create your account to start learning or sharing your knowledge
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* {actionState?.errors && (
              <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{actionState.errors}</p>
              </div>
            )} */}

            <form action={action} className="space-y-3">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`${actionStateErrors.firstName ? "border-destructive" : ""}`}
                    required
                  />
                  {displayErrors && DisplayErrors("firstName", actionStateErrors)}
                </div>
                <div>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`${actionStateErrors.lastName ? "border-destructive" : ""}`}
                    required
                  />
                  {displayErrors && DisplayErrors("lastName", actionStateErrors)}
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${actionStateErrors.email ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {displayErrors && DisplayErrors("email", actionStateErrors)}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pr-10 pl-10 ${
                      actionStateErrors.password ? "border-destructive" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {displayErrors && DisplayErrors("password", actionStateErrors)}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 ${
                      formData.confirmPassword !== formData.password ? "border-destructive" : ""
                    }`}
                    required
                  />
                </div>
                {formData.confirmPassword !== formData.password && (
                  <p className="text-destructive mt-1 text-xs">Passwords do not match</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    // className="sr-only"
                    required
                  />
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: !prev.agreeToTerms,
                      }))
                    }
                  />
                </div>
                <div className="text-sm leading-5">
                  <label htmlFor="agreeToTerms" className="cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-base font-medium"
                disabled={actionPending}
              >
                {actionPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="border-muted flex-1 border-t"></div>
              <div className="text-muted-foreground mx-4 text-sm">or</div>
              <div className="border-muted flex-1 border-t"></div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" type="button">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full" type="button">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Continue with Instagram
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const DisplayErrors = (
  name: string,
  actionStateErrors: Record<string, { errors: string | string[] }>
) => {
  return (
    <>
      {actionStateErrors[name] && (
        <p className="text-destructive mt-1 text-xs">
          {typeof actionStateErrors[name].errors === "string" ? (
            actionStateErrors[name].errors
          ) : (
            <ul>
              {actionStateErrors[name].errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </p>
      )}
    </>
  );
};
