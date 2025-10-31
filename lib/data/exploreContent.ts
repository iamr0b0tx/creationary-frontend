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
    const response = await fetch(`${baseUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }
    const content = await response.json();
    const { posts, pagination } = content.datacontent.data;

    return { status: "success", pagination, posts };
  } catch (err) {
    throw new Error("Error fetching content data");
    logger.error("Error fetching content data:", err);
  }
};

export { categories, getContentData };
