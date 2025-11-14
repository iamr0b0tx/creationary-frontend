import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TContentItem, TUser } from "./types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToFormData(obj: Record<string, unknown>) {
  const formData = new FormData();

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Handle nested objects or arrays by stringifying them
      if (typeof value === "object" && value !== null && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value instanceof Blob ? value : String(value));
      }
    }
  }
  return formData;
}

export const transformContent = (items: TContentItem[]) => {
  return items.map((item, idx) => ({
    ...item,
    creator: {
      name: (item.author?.firstName ?? "Anonymous") + " " + (item.author?.lastName ?? "User"),
      username: item.author?._id ?? idx,
      avatar: "/",
      verified: false,
    },
  }));
};

const mapCategory: Record<string, string> = {
  "690239c41c9c94d0ace64bbd": "Fitness",
  "690eb92cc251276890ec5693": "Photography",
  "69108e38171cfbab8cdd57ab": "Music"
}

export const transformedCreator = (creator: TUser) => {
  return {
    ...creator,
    firstName: creator.firstName ?? "Anonymous",
    lastName: creator.lastName ?? "User",
    verified: true, // Placeholder: Replace with actual verification status from API
    name: `${creator.firstName ?? "Anonymout"} ${creator.lastName ?? "User"}`,
    category: mapCategory[creator._id] ?? "Music", // Placeholder: Replace with actual category from API
    location: "Lagos, Nigeria", // Placeholder: Replace with actual location from API
    bio: `Hi, I'm ${creator.firstName}, a passionate ${mapCategory[creator._id] ?? "Music"} coach.`,
    socialLinks: {
      website: "https://creator-website.com",
      instagram: "@creator_insta",
      twitter: "@creator_twitter",
    },
    avatar: "/default_avatar.png", // Placeholder: Replace with actual avatar URL from API
    content: creator.posts,
    joinedDate: offsetCurrentDate(5), // Placeholder: Replace with actual joined date from API
    followers: 0, // Placeholder: Replace with actual followers count from API
    stats: {
      totalContent: creator.posts.length,
      avgRating: 0, // Placeholder: Replace with actual average rating from API
      totalViews: 0, // Placeholder: Replace with actual total views from API
      totalReviews: 0, // Placeholder: Replace with actual total reviews from API
    },
  };
};

// This is just to model the user data as I am not given the joined Date.
export function offsetCurrentDate(n: number): Date {
  const currentDate = new Date(); // Get the current date and time
  currentDate.setDate(currentDate.getDate() + n); // Add or subtract n days
  return currentDate;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 60 * 24) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
};