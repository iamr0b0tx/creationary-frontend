import { contentData, getContentData } from "@/lib/data/exploreContent";
import ExplorePageComponent from "./explorePageComponent";
import logger from "@/lib/serverLogger";
import { getSession } from "../action/auth";
import { TContentItem } from "@/lib/types/types";
import { cookies } from "next/headers";

export default async function ExplorePage() {
  const rawContent = await getContentData((await cookies()).get("token")?.value ?? "");
  const user = await getSession();
  logger.info("Fetched content data for Explore Page:", user);

  // Helper function to transform API data to match UI structure
  const transformContent = (items: TContentItem[]) => {
    return items.map((item, index) => ({
      id: item.id || `${index + 1}`,
      title: item.title || "Untitled Content",
      creator: {
        name: "Anonymous Creator",
        username: "user-" + (item.id?.slice(-6) || index),
        avatar: "/default-avatar.png",
        verified: false,
      },
      thumbnail: "/default-thumbnail.png",
      category: "General",
      price: item.price,
      originalPrice: item.originalPrice,
      isFree: item.isFree,
      rating: item.rating,
      reviews: item.reviews,
      views: item.views,
      likes: Math.floor(Math.random() * 500) + 10,
      duration: "2h 30m",
      description: item.content || "No description available.",
    }));
  };



  const content = rawContent ? transformContent(rawContent) : null;
  // use content if fetched successfully, otherwise fallback to static contentData
  return <ExplorePageComponent initialContent={content ?? contentData} />;
}
