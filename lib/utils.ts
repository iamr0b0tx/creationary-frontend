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
  return items.map((item) => ({
    ...item,
    creator: {
      name: item.author.firstName + " " + item.author.lastName || "Anonymous User",
      username: item.author._id,
      avatar: "/default-avatar.png",
      verified: false,
    },
  }));
};

// This is just to model the user data as I am not given the joined Date.
export function offsetCurrentDate(n: number): Date {
  const currentDate = new Date(); // Get the current date and time
  currentDate.setDate(currentDate.getDate() + n); // Add or subtract n days
  return currentDate;
}
