"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Heart, Lock, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { featuredContent, featuredCreators } from "@/lib/data/homepageDummy";


export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="home-wrapper">
      {/* Header */}
      <header className="home-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="logo-wrapper">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Creationary</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/explore"
              className="top-link"
            >
              Explore
            </Link>
            <Link
              href="/pricing"
              className="top-link"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="top-link"
            >
              About
            </Link>
          </nav>

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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="">
            <Badge variant="secondary" className="mb-4">
              Join 50,000+ creators earning online
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Monetize Your
              <span className="text-primary"> Creative Content</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Build your audience, sell your content, and earn recurring
              revenue. The all-in-one platform for creators to turn their
              passion into profit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Creators</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover amazing creators who are building successful businesses
              on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <Link key={creator.id} href={`/user/${creator.username}`}>
                <Card
                  className="hover:shadow-lg transition-all duration-300  cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(creator.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                <CardHeader className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage
                      src={creator.avatar || "/placeholder.svg"}
                      alt={creator.name}
                    />
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {creator.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">
                        {creator.subscribers.toLocaleString()}
                      </p>
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
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending Content</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the most popular content from our creator community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredContent.map((content, index) => (
              <Card
                key={content.id}
                className="card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={content.thumbnail || "/placeholder.svg"}
                    alt={content.title}
                    className="img"
                  />
                  {content.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-black/70 text-white"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{content.likes}</span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{content.category}</Badge>
                    {content.price > 0 ? (
                      <span className="font-bold text-primary">
                        ${content.price}
                      </span>
                    ) : (
                      <span className="font-bold text-green-600">Free</span>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {content.title}
                  </CardTitle>
                  <CardDescription>by {content.creator}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Creator Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are already building their audience
              and earning from their content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/creator/auth/signup">Become a Creator</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">Join as Member</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Creationary</span>
              </div>
              <p className="text-muted-foreground">
                Empowering creators to monetize their passion and build
                sustainable businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Creators</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/creator/dashboard"
                    className="footer-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/analytics"
                    className="footer-link"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/payouts"
                    className="footer-link"
                  >
                    Payouts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Members</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/explore"
                    className="footer-link"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscriptions"
                    className="footer-link"
                  >
                    Subscriptions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library"
                    className="footer-link"
                  >
                    Library
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/help"
                    className="support-link"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="support-link"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="support-link"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Creationary. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
