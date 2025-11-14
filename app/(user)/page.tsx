import { getContentData } from "@/lib/data/exploreContent";
import HomePageComponent from "./HomepageComponent";
import { cookies } from "next/headers";
import { getCreators } from "@/lib/data/creator";

export default async function HomePage() {
  const userToken = (await cookies()).get("token")?.value ?? "";
  const [{ posts }, { data }] = await Promise.all([
    getContentData(userToken, "1", ""),
    getCreators(),
  ]);
  return (
    <HomePageComponent
      featuredContent={posts.slice(0, 3)}
      featuredCreators={data.items.slice(-3)}
    />
  );
}
