import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function debounce<T extends unknown[]>(
  func: (...args: T) => Promise<void> | void,
  timeout = 300
): (...args: T) => void {
  let timer: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
