export type ResetPasswordActionState = {
  status: "no_action" | "pending" | "success" | "error" | "password_mismatch";
};

export type ForgotPasswordActionState = {
  status: "no_action" | "pending" | "success" | "error" | "invalid_email";
};