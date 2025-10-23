"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, Heart, Eye, Lock, Play, Star } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

type TCategory =
  | "Photography"
  | "Music"
  | "Fitness"
  | "Cooking"
  | "Art"
  | "Business"
  | "Technology"
  | "All";

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


const contentData = [
  {
    id: 1,
    title: "Professional Portrait Photography Masterclass",
    creator: {
      name: "Sarah Chen",
      username: "sarah-chen",
      avatar: "/female-photographer.png",
      verified: true,
    },
    thumbnail: "/portrait-studio.png",
    category: "Photography",
    price: 49.99,
    originalPrice: 79.99,
    isPremium: true,
    rating: 4.9,
    reviews: 234,
    views: 12500,
    likes: 890,
    duration: "3h 45m",
    description:
      "Learn advanced portrait lighting techniques and posing strategies used by professional photographers.",
  },
  {
    id: 2,
    title: "Beat Making Fundamentals in Logic Pro",
    creator: {
      name: "Marcus Johnson",
      username: "marcus-johnson",
      avatar: "/male-music-producer.jpg",
      verified: true,
    },
    thumbnail: "/music-production-studio.png",
    category: "Music",
    price: 0,
    originalPrice: null,
    isPremium: false,
    rating: 4.7,
    reviews: 156,
    views: 8900,
    likes: 567,
    duration: "2h 30m",
    description:
      "Master the basics of beat making with step-by-step tutorials and real-world examples.",
  },
  {
    id: 3,
    title: "30-Day Home Workout Challenge",
    creator: {
      name: "Elena Rodriguez",
      username: "elena-rodriguez",
      avatar: "/female-fitness-trainer.png",
      verified: true,
    },
    thumbnail: "/home-fitness.png",
    category: "Fitness",
    price: 29.99,
    originalPrice: null,
    isPremium: true,
    rating: 4.8,
    reviews: 445,
    views: 15600,
    likes: 1200,
    duration: "30 days",
    description:
      "Transform your fitness with daily workout routines that require no equipment.",
  },
  {
    id: 4,
    title: "Italian Cooking Essentials",
    creator: {
      name: "Giuseppe Romano",
      username: "giuseppe-romano",
      avatar: "/italian-chef.png",
      verified: false,
    },
    thumbnail: "/italian-cooking-pasta.png",
    category: "Cooking",
    price: 24.99,
    originalPrice: 34.99,
    isPremium: true,
    rating: 4.6,
    reviews: 89,
    views: 5400,
    likes: 234,
    duration: "4h 15m",
    description:
      "Learn authentic Italian recipes and cooking techniques from a traditional chef.",
  },
  {
    id: 5,
    title: "Digital Art for Beginners",
    creator: {
      name: "Yuki Tanaka",
      username: "yuki-tanaka",
      avatar: "/digital-artist.png",
      verified: true,
    },
    thumbnail: "/digital-art-illustration.jpg",
    category: "Art",
    price: 0,
    originalPrice: null,
    isPremium: false,
    rating: 4.5,
    reviews: 78,
    views: 3200,
    likes: 189,
    duration: "1h 50m",
    description:
      "Start your digital art journey with fundamental techniques and software basics.",
  },
  {
    id: 6,
    title: "Startup Business Strategy",
    creator: {
      name: "Alex Thompson",
      username: "alex-thompson",
      avatar: "/business-entrepreneur.jpg",
      verified: true,
    },
    thumbnail: "/business-strategy-meeting.png",
    category: "Business",
    price: 99.99,
    originalPrice: 149.99,
    isPremium: true,
    rating: 4.9,
    reviews: 167,
    views: 7800,
    likes: 456,
    duration: "5h 30m",
    description:
      "Build a successful startup with proven strategies and real case studies.",
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<TCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Simulated API calls
  const handleSearch = async (query: string) => {
    logger.log(`Simulated API call: GET /api/content/search?q=${query}`);
    // Backend will handle content search
  };

  const handleLikeContent = async (contentId: number) => {
    logger.log(`Simulated API call: POST /api/content/${contentId}/like`);
    // Backend will handle like functionality
  };

  const handlePurchaseContent = async (contentId: number) => {
    // Redirect to checkout page with product ID
    router.push(`/checkout?product=${contentId}`);
  };

  const filteredContent = contentData.filter((content) => {
    const matchesCategory =
      selectedCategory === "All" || content.category === selectedCategory;
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
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
          <h1 className="text-3xl font-bold mb-2">Explore Content</h1>
          <p className="text-muted-foreground">
            Discover amazing content from talented creators
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search content or creators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content, index) => (
            <Card
              key={content.id}
              className="overflow-hidden pt-0 pb-0 hover:shadow-lg transition-all duration-300 animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(content.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Content Image Start */}
              <div className="relative">
                {/* <img
                  src={content.thumbnail || "/placeholder.svg"}
                  alt={content.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                /> */}

                {/* Overlay on hover */}
                {/* <div
                  className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredCard === content.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Button
                    size="sm"
                    className="animate-bounce-subtle"
                    onClick={() =>
                      content.price > 0
                        ? handlePurchaseContent(content.id)
                        : null
                    }
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {content.price > 0 ? "Purchase" : "Watch Free"}
                  </Button>
                </div> */}

                {/* Badges */}
                {/* <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{content.category}</Badge>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {content.isPremium && (
                    <Badge
                      variant="secondary"
                      className="bg-black/70 text-white"
                    >
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {content.originalPrice && (
                    <Badge variant="destructive" className="bg-red-600">
                      Sale
                    </Badge>
                  )}
                </div> */}

                {/* Stats */}
                {/* <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-white text-sm">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {content.views.toLocaleString()}
                  </span>
                  <button
                    className="flex items-center hover:text-red-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeContent(content.id);
                    }}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    {content.likes}
                  </button>
                </div> */}
              </div>
              {/* Content Image End */}

              <CardHeader className="pb-3 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={content.creator.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {content.creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/user/${content.creator.username}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {content.creator.name}
                    </Link>
                    {content.creator.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {content.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({content.reviews})
                    </span>
                  </div>
                </div>

                <CardTitle className="text-lg line-clamp-2 mb-2">
                  {content.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mb-3">
                  {content.description}
                </CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {content.price > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">
                          ${content.price}
                        </span>
                        {content.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${content.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-green-600">
                        Free
                      </span>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Content
          </Button>
        </div>
      </div>
    </div>
  );
}
