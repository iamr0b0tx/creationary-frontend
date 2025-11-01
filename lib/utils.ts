import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TContentItem } from "./types/types";

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
  return items.map((item, index) => ({
    ...item,
    creator: {
      name: "Anonymous Creator",
      username: "user-" + (item._id?.slice(-6) || index),
      avatar: "/default-avatar.png",
      verified: false,
    },
  }));
};
