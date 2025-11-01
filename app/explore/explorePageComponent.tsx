"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, Play, Star } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/clientLogger";
import { categories } from "@/lib/data/exploreContent";
import { PaginationWrapper } from "@/components/wrappers/paginationWrapper";
import { TCategory, TContentItem, TPagination } from "@/lib/types/types";
import { debounce } from "@/lib/utils";

// const ITEMS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 5;

export default function ExplorePageComponent({
  initialContent,
  pagination,
}: {
  initialContent: TContentItem[];
  pagination: TPagination;
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<TCategory>("All");
  const [_hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handleSearch = debounce(async (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set("query", query);
      params.set("page", "1"); // Reset to first page on new search
    } else {
      params.delete("query");
      params.set("page", "1"); // Reset to first page if search is cleared
    }
    router.replace(`${pathname}?${params.toString()}`);
  });

  const _handleLikeContent = async (contentId: number) => {
    logger.info(`Simulated API call: POST /api/content/${contentId}/like`);
    // Backend will handle like functionality
  };

  const _handlePurchaseContent = async (contentId: number) => {
    // Redirect to checkout page with product ID
    router.push(`/checkout?product=${contentId}`);
  };

  const filteredContent = initialContent.filter((content) => {
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;

    return matchesCategory;
  });

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Play className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Creationary</span>
          </Link>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Explore Content</h1>
          <p className="text-muted-foreground">Discover amazing content from talented creators</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search content or creators..."
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((content, index) => (
            <Card
              key={content.id + "" + index}
              className="animate-fade-in-up group cursor-pointer overflow-hidden pt-0 pb-0 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(content.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="h-full py-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={content.creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {content.creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/creator/${content.creator.username}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {content.creator.name}
                    </Link>
                    {content.creator.verified && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{content.rating}</span>
                    <span className="text-muted-foreground text-sm">({content.reviews})</span>
                  </div>
                </div>

                <CardTitle className="mb-2 line-clamp-2 text-lg">{content.title}</CardTitle>
                <CardDescription className="mb-3 line-clamp-2">
                  {content.description}
                </CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {content.price > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-primary text-lg font-bold">₦{content.price}</span>
                        {content.originalPrice && (
                          <span className="text-muted-foreground text-sm line-through">
                            ₦{content.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-green-600">Free</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {content.duration}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <PaginationWrapper
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={pagination.totalPages}
          maxVisiblePages={MAX_VISIBLE_PAGES}
          className="mt-10 justify-center"
        />
      </div>
    </div>
  );
}
