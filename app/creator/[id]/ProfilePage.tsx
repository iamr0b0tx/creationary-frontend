"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Eye,
  Users,
  MapPin,
  Calendar,
  Star,
  Play,
  Share,
  MessageCircle,
  Instagram,
  Globe,
  createLucideIcon,
} from "lucide-react";
import Link from "next/link";
import { getCreatorData } from "@/lib/data/creator";
import Image from "next/image";
import { logger } from "@/lib/clientLogger";

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);
export default function UserProfileContent({ id }: { id: number }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [isFollowing, setIsFollowing] = useState(false);

  const creator = getCreatorData(id);

  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Creator Not Found</CardTitle>
            <CardDescription>
              The creator you&apos;re looking for doesn&apos;t exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full">Explore Creators</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Play className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Creationary</span>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Join Now</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <Image
          //src={creator.coverImage}
          src={"/default_image.png"}
          width={1000}
          height={1000}
          alt="Cover"
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            // Only replace once to avoid infinite loop
            if (target.src !== "/default_image.png") {
              target.src = "/default_image.png";
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="relative z-10 container mx-auto -mt-16 px-4">
        <div className="mb-8 flex flex-col gap-6 md:flex-row">
          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-end">
              <Avatar className="border-background h-32 w-32 border-4 shadow-xl">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-2xl">
                  {creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 md:ml-4">
                <div className="mb-2 flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-amber-100">{creator.name}</h1>
                  {creator.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Star className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="mb-2">
                  {creator.category}
                </Badge>
                <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {creator.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(creator.joinedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:pl-[10.2rem]">
              <p className="text-muted-foreground mb-4">{creator.bio}</p>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-left">
                  <div className="text-2xl font-bold">{creator.followers.toLocaleString()}</div>
                  <div className="text-muted-foreground text-sm">Followers</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{creator.stats.totalContent}</div>
                  <div className="text-muted-foreground text-sm">Content</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{creator.stats.avgRating}</div>
                  <div className="text-muted-foreground text-sm">Rating</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">
                    {creator.stats.totalViews.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-sm">Views</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6 flex items-center gap-3">
                {creator.socialLinks.website && (
                  <Button variant="outline" size="icon" className="hover:bg-amber-100" asChild>
                    <a href={creator.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {creator.socialLinks.instagram && (
                  <Button
                    className="hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a
                      href={`https://instagram.com/${creator.socialLinks.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {creator.socialLinks.twitter && (
                  <Button
                    variant="outline"
                    className="hover:bg-black/90 hover:text-white"
                    size="icon"
                    asChild
                  >
                    <a
                      href={`https://x.com/${creator.socialLinks.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <XIcon className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:w-48">
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              variant={isFollowing ? "outline" : "default"}
              className="w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                const shareData = {
                  title: `${creator.name} - Creationary`,
                  text: `Check out ${creator.name}'s profile on Creationary!`,
                  url: window.location.href,
                };

                try {
                  // Check if Web Share API is supported (works on mobile and some desktop browsers)
                  if (navigator.share) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                } catch (error) {
                  // User cancelled share or error occurred
                  if (error instanceof Error && error.name !== "AbortError") {
                    logger.error("Error sharing:", error);
                  }
                }
              }}
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content ({creator.content.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({creator.stats.totalReviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creator.content.map((item) => (
                <Card key={item.id} className="group transition-all duration-300 hover:shadow-lg">
                  {/* Note that this is remove because we do no support images currently. */}
                  {/* <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isFree && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                        <Lock className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button size="sm" variant="secondary">
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div> */}

                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-muted-foreground text-sm">({item.reviews})</span>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">{item.duration}</div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {item.likes.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-muted-foreground text-sm leading-[1rem] line-through">
                            ₦{item.originalPrice}
                          </span>
                        )}
                        <span className="text-primary text-lg font-bold">
                          {item.price === 0 ? "Free" : `₦${item.price}`}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (item.price === 0) {
                            // Handle free content viewing
                            console.log("Play free content:", item.id);
                          } else {
                            // Navigate to checkout
                            router.push(`/checkout?product=${item.id}`);
                          }
                        }}
                      >
                        {item.price === 0 ? "Watch Now" : "Purchase"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="h-8 w-fit bg-[url('/yellow-brushstroke.webp')] bg-[length:110%_110%] bg-no-repeat py-1 text-xl">
                  About {creator.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 divide-y-2">
                  <div>
                    <h4 className="mb-2 font-semibold">Bio</h4>
                    <p className="text-muted-foreground">{creator.bio}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Specialization</h4>
                    <Badge variant="outline" className="mb-2">
                      {creator.category}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Location</h4>
                    <p className="text-muted-foreground">{creator.location}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Member Since</h4>
                    <p className="text-muted-foreground">
                      {new Date(creator.joinedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {/* Reviews would be loaded here */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-center">
                    <MessageCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Reviews feature coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
