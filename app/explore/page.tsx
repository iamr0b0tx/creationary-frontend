import { contentData, getContentData } from "@/lib/data/exploreContent";
import ExplorePageComponent from "./explorePageComponent";
type TCurrentContent =     {
  "_id": string,
  "title": string,
  "content": string,
  "paid": boolean,
  "createdAt": string,
  "updatedAt": string,
  "__v": number
}
export default async function ExplorePage () {
  const rawContent = await getContentData();
  
  // Helper function to transform API data to match UI structure
  const transformContent = (items: TCurrentContent[]) => {
    return items.map((item, index) => ({
      id: item._id || `${index + 1}`,
      title: item.title || "Untitled Content",
      creator: {
        name: "Anonymous Creator",
        username: "user-" + (item._id?.slice(-6) || index),
        avatar: "/default-avatar.png",
        verified: false,
      },
      thumbnail: "/default-thumbnail.png",
      category: "General",
      price: item.paid ? 29.99 : 0,
      originalPrice: item.paid ? 49.99 : 0,
      isPremium: item.paid || false,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100) + 10,
      views: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 500) + 10,
      duration: "2h 30m",
      description: item.content || "No description available.",
    }));
  };
  
  const content = rawContent ? transformContent(rawContent) : null;
  // use content if fetched successfully, otherwise fallback to static contentData
  return <ExplorePageComponent initialContent={content ?? contentData} />;
}