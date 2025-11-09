import { getContentData } from "@/lib/data/exploreContent";
import HomePageComponent from "./HomepageComponent";
import { cookies } from "next/headers";

export default async function HomePage() {
  const userToken = (await cookies()).get("token")?.value ?? "";
  const { posts } = await getContentData(userToken, "1", "");
  return <HomePageComponent featuredContent={posts.slice(0, 3)} />;
}
