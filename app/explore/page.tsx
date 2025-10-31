import { getContentData } from "@/lib/data/exploreContent";
import ExplorePageComponent from "./explorePageComponent";
import { TContentItem } from "@/lib/types/types";
import { cookies } from "next/headers";

export default async function ExplorePage(
  props: Promise<{
    page: string;
  }>
) {
  const page = (await props).page;
  const { pagination, posts } = await getContentData((await cookies()).get("token")?.value ?? "", page);

  const transformContent = (items: TContentItem[]) => {
    return items.map((item, index) => ({
      ...item,
      creator: {
        name: "Anonymous Creator",
        username: "user-" + (item.id?.slice(-6) || index),
        avatar: "/default-avatar.png",
        verified: false,
      },
    }));
  };

  const content = posts ? transformContent(posts) : null;

  if (!content) return <div>No content to display for now</div>;
  return <ExplorePageComponent pagination={pagination} initialContent={content} />;
}
