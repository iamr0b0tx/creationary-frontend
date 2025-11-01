"use server";

import { baseUrl } from "@/lib/baseUrl";
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

    // Build headers with correct content type and optional auth
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json", 
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const { message } = await response.json();
      logger.error("Failed to upload content:", message);
      throw new Error(message);
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

export const addComment = async (
  contentId: string,
  commentText: string
): Promise<PostActionState> => {
  try {
    const token = (await cookies()).get("token")?.value;
    console.log("conetne" , contentId, commentText);

    const response = await fetch(`${baseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post: contentId, content: commentText }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      logger.error("Failed to add comment:", message);
      throw new Error(message);
    }

    await response.json();
    logger.info("Comment added successfully");
    return { status: "success" };
  } catch (error: unknown) {
    logger.error("Error adding comment:", error);
    return {
      status: "error",
      message: (error as Error).message ?? "An error occurred while adding the comment.",
    };
  }
}