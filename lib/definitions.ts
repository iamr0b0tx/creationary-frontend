import z from "zod";

export const signUpFormSchema = z.object({
  firstName: z.string().min(3, "First name is required").trim(),
  lastName: z.string().min(3, "Last name is required").trim(),
  email: z.email("Invalid email address").trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const loginFormSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required").trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});


export const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long").trim(),
  // isFree: z.boolean(),
  // thumbnail: z.url("Thumbnail must be a valid URL").trim(),
  content: z.string().min(20, "Content must be at least 20 characters long").trim(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  category: z.string().min(1, "Category is required").trim(),
  price: z.number().min(0, "Price must be a positive number"),
  originalPrice: z
    .number()
    .min(0, "Original price must be a positive number")
    .optional()
    .nullable(),
  // duration: z.string().min(1, "Estimated duration is required").trim(),
  // contentUrl: z.string().url("Content URL must be a valid URL").trim(),
});
