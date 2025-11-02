import { getContentData } from "@/lib/data/exploreContent";
import ExplorePageComponent from "./explorePageComponent";
import { cookies } from "next/headers";
import { transformContent } from "@/lib/utils";

export default async function ExplorePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await props.searchParams;
  const currentPage = params?.page || "1";
  const query = params?.query || "";
  const { pagination, posts } = await getContentData(
    (await cookies()).get("token")?.value ?? "",
    currentPage,
    query
  );

  const content = posts ? transformContent(posts) : null;

  if (!content) return <div>No content to display for now</div>;
  return <ExplorePageComponent pagination={pagination} initialContent={content} />;
}
