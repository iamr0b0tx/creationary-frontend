"use server";

import { postSchema } from "@/lib/definitions";
import logger from "@/lib/serverLogger";
import { PostActionState } from "@/lib/types/types";
import { cookies } from "next/headers";
import z from "zod";

export const createPost = async (
  tags: string[],
  _: PostActionState,
  data: FormData
): Promise<PostActionState> => {
  // pass the features and authorId as arguments

  try {
    const token = (await cookies()).get("token")?.value;
    logger.info("Creating new post with tags:", tags);
    logger.info("FormData entries:", JSON.stringify(Object.fromEntries(data.entries())));
    const validatedFields = postSchema.safeParse({
      title: data.get("title"),
      content: data.get("content"),
      category: data.get("category"),
      price: Number(data.get("price")),
      originalPrice: data.get("originalPrice") ? Number(data.get("originalPrice")) : null,
      description: data.get("description"),
      // duration: data.get("estimatedDuration"),
      features: tags,
    });

    if (!validatedFields.success) {
      logger.error("Post validation failed:", validatedFields.error.format());
      return {
        status: "validation_error",
        errors: z.treeifyError(validatedFields.error).properties,
      };
    }

    console.log("Validated post fields:", JSON.stringify(validatedFields.data));

    const response = await fetch(`${process.env.BASE_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        ContentType: "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const res = await response.text();
      logger.error("Failed to upload content:", res);
      throw new Error(JSON.parse(res).message ?? "Failed to upload content");
    }

    await response.json();
    return { status: "success" };
  } catch (error: unknown) {
    logger.error("Error creating post:", error);
    return {
      status: "error",
      message: (error as Error).message ?? "An error occurred while creating the post.",
    };
  }
};
