import { baseUrl } from "../baseUrl";
import { logger } from "../clientLogger";
import { TCategory } from "../types/types";

const categories: TCategory[] = [
  "All",
  "Photography",
  "Music",
  "Fitness",
  "Cooking",
  "Art",
  "Technology",
  "Business",
];

const getContentData = async (userToken: string, page: string) => {
  try {
    const response = await fetch(`${baseUrl}/posts?page=${page}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      next: {
        revalidate: 24 * 60 * 60, // Revalidate once every 24 hours
        tags: [`page-${page}`],
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }
    const content = await response.json();
    const { posts, pagination } = content.data;

    return { status: "success", pagination, posts };
  } catch (err) {
    logger.error("Error fetching content data:", err);
    throw new Error("Error fetching content data");
  }
};

export { categories, getContentData };
