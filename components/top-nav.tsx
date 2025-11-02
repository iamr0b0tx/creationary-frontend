"use client";

import { Loader2, Play } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { TUser } from "@/lib/types/types";
import { handleLogout } from "@/app/action/auth";

const TopNav = ({ user }: { user: TUser | null }) => {
  const [isPending, startTransition] = useTransition();

  const logoutAction = async () => {
    startTransition(async () => {
      await handleLogout();
    });
  };

  return (
    <header className="home-header">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="logo-wrapper">
            <Play className="text-primary-foreground h-4 w-4" />
          </Link>
          <span className="text-xl font-bold">Creationary</span>
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/explore" className="top-link">
            Explore
          </Link>
          <Link href="/pricing" className="top-link">
            Pricing
          </Link>
          <Link href="/about" className="top-link">
            About
          </Link>
        </nav>

        {!user ? (
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button onClick={logoutAction} asChild>
              <Link href='/creator/upload' >Upload Post</Link>
            </Button>
            <Button className="bg-red-500" onClick={logoutAction}>
              {isPending ? <Loader2 className="animate-spin" /> : "Log Out"}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
