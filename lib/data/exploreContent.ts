import { logger } from "../clientLogger";
import { TCategory } from "../types/types";

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

const getContentData = async (userToken: string) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/posts`, {
      headers: {
        "Authorization": `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      console.log("Failed to fetch content data:", response.statusText, response);
      throw new Error("Failed to fetch content");
    }
    const content = await response.json();
    logger.info("Content data fetched successfully", content);
    return content.data;
  } catch (err) {
    logger.error("Error fetching content data:", err);
  }
};

const contentData = [
  {
    id: "1",
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
    isFree: false,
    rating: 4.9,
    reviews: 234,
    views: 12500,
    likes: 890,
    duration: "3h 45m",
    description:
      "Learn advanced portrait lighting techniques and posing strategies used by professional photographers.",
  },
  {
    id: "2",
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
    isFree: true,
    rating: 4.7,
    reviews: 156,
    views: 8900,
    likes: 567,
    duration: "2h 30m",
    description:
      "Master the basics of beat making with step-by-step tutorials and real-world examples.",
  },
  {
    id: "3",
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
    isFree: false,
    rating: 4.8,
    reviews: 445,
    views: 15600,
    likes: 1200,
    duration: "30 days",
    description: "Transform your fitness with daily workout routines that require no equipment.",
  },
  {
    id: "4",
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
    isFree: false,
    rating: 4.6,
    reviews: 89,
    views: 5400,
    likes: 234,
    duration: "4h 15m",
    description: "Learn authentic Italian recipes and cooking techniques from a traditional chef.",
  },
  {
    id: "5",
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
    isFree: true,
    rating: 4.5,
    reviews: 78,
    views: 3200,
    likes: 189,
    duration: "1h 50m",
    description: "Start your digital art journey with fundamental techniques and software basics.",
  },
  {
    id: "6",
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
    isFree: false,
    rating: 4.9,
    reviews: 167,
    views: 7800,
    likes: 456,
    duration: "5h 30m",
    description: "Build a successful startup with proven strategies and real case studies.",
  },
];

export { categories, contentData, getContentData };
