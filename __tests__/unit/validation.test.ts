import { describe, it, expect } from "vitest";
import { postSchema, signUpFormSchema, loginFormSchema } from "@/lib/definitions";

describe("Form Validation Schemas", () => {
  describe("postSchema", () => {
    const validPost = {
      title: "Valid Test Title",
      description: "This is a valid description that meets the minimum length requirement",
      content: "This is valid content that is definitely long enough to pass validation",
      features: ["Feature 1", "Feature 2"],
      category: "Technology",
      price: 29.99,
      originalPrice: 39.99,
    };

    it("should validate a correct post", () => {
      const result = postSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it("should reject post with short title", () => {
      const result = postSchema.safeParse({
        ...validPost,
        title: "sm",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 5 characters");
      }
    });

    it("should reject post with short description", () => {
      const result = postSchema.safeParse({
        ...validPost,
        description: "Too short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters");
      }
    });

    it("should reject post with short content", () => {
      const result = postSchema.safeParse({
        ...validPost,
        content: "Too short content",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 20 characters");
      }
    });

    it("should reject post without features", () => {
      const result = postSchema.safeParse({
        ...validPost,
        features: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("At least one feature");
      }
    });

    it("should reject negative price", () => {
      const result = postSchema.safeParse({
        ...validPost,
        price: -10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("positive number");
      }
    });

    it("should accept null originalPrice", () => {
      const result = postSchema.safeParse({
        ...validPost,
        originalPrice: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("signUpFormSchema", () => {
    const validSignUp = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "ValidPass123!",
    };

    it("should validate a correct signup form", () => {
      const result = signUpFormSchema.safeParse(validSignUp);
      expect(result.success).toBe(true);
    });

    it("should reject short first name", () => {
      const result = signUpFormSchema.safeParse({
        ...validSignUp,
        firstName: "Jo",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const result = signUpFormSchema.safeParse({
        ...validSignUp,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without special character", () => {
      const result = signUpFormSchema.safeParse({
        ...validSignUp,
        password: "ValidPass123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = signUpFormSchema.safeParse({
        ...validSignUp,
        password: "ValidPass!",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without letter", () => {
      const result = signUpFormSchema.safeParse({
        ...validSignUp,
        password: "12345678!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginFormSchema", () => {
    const validLogin = {
      email: "john.doe@example.com",
      password: "ValidPass123!",
    };

    it("should validate a correct login form", () => {
      const result = loginFormSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it("should reject empty email", () => {
      const result = loginFormSchema.safeParse({
        ...validLogin,
        email: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const result = loginFormSchema.safeParse({
        ...validLogin,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = loginFormSchema.safeParse({
        ...validLogin,
        password: "short",
      });
      expect(result.success).toBe(false);
    });
  });
});
