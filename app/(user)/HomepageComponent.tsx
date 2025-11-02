"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Heart, Lock } from "lucide-react";
import Link from "next/link";
import { featuredContent, featuredCreators } from "@/lib/data/homepageDummy";

export default function HomePageComponent() {
  const [_hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="">
            <Badge variant="secondary" className="mb-4">
              Join 50,000+ creators earning online
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Monetize Your
              <span className="text-primary"> Creative Content</span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl text-pretty">
              Build your audience, sell your content, and earn recurring revenue. The all-in-one
              platform for creators to turn their passion into profit.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="animate-pulse-subtle" asChild>
                <Link href="/creator/auth/signup">Start Creating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Browse Content</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Featured Creators</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Discover amazing creators who are building successful businesses on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredCreators.map((creator, index) => (
              <Link key={creator._id} href={`/user/${creator.username}`}>
                <Card
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(creator._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="text-center">
                    <Avatar className="mx-auto mb-4 h-16 w-16">
                      <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                      <AvatarFallback>
                        {creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{creator.name}</CardTitle>
                    <CardDescription>{creator.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm">{creator.description}</p>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="font-semibold">{creator.subscribers.toLocaleString()}</p>
                        <p className="text-muted-foreground">Subscribers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${creator.monthlyEarnings.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">Monthly</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Trending Content</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Explore the most popular content from our creator community
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredContent.map((content, index) => (
              <Card
                key={content._id}
                className="card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={content.thumbnail || "/placeholder.svg"}
                    alt={content.title}
                    className="img"
                  />
                  {!content.isFree && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        <Lock className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{content.likes}</span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{content.category}</Badge>
                    {content.price > 0 ? (
                      <span className="text-primary font-bold">${content.price}</span>
                    ) : (
                      <span className="font-bold text-green-600">Free</span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{content.title}</CardTitle>
                  <CardDescription>by {content.creator}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">Ready to Start Your Creator Journey?</h2>
            <p className="text-muted-foreground mb-8 text-xl">
              Join thousands of creators who are already building their audience and earning from
              their content.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Become a Creator</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">Join as Member</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t px-4 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Play className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="text-xl font-bold">Creationary</span>
              </div>
              <p className="text-muted-foreground">
                Empowering creators to monetize their passion and build sustainable businesses.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">For Creators</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link href="/creator/dashboard" className="footer-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/creator/analytics" className="footer-link">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/creator/payouts" className="footer-link">
                    Payouts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">For Members</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link href="/explore" className="footer-link">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/subscriptions" className="footer-link">
                    Subscriptions
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="footer-link">
                    Library
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link href="/help" className="support-link">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="support-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="support-link">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground mt-8 border-t pt-8 text-center">
            <p>&copy; 2025 Creationary. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
