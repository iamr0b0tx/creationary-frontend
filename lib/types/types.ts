export type ResetPasswordActionState = {
  status: "no_action" | "pending" | "success" | "error" | "password_mismatch";
};

export type ForgotPasswordActionState = {
  status: "no_action" | "pending" | "success" | "error" | "invalid_email";
  message?: string;
  timestamp?: number;
};
export type LoginActionState = {
  errors?: string | Record<string, { errors: string[] }>;
  status: "no_action" | "pending" | "success" | "error" | "invalid_email";
  message?: string;
};

export type PostActionState = {
  errors?: string | Record<string, { errors: string[] }>;
  status: "no_action" | "pending" | "success" | "error" | "invalid_email" | "validation_error";
  message?: string;
};

export type TCategory =
  | "Photography"
  | "Music"
  | "Fitness"
  | "Cooking"
  | "Art"
  | "Business"
  | "Technology"
  | "All";

export type TContentItem = {
  _id: string; // corresponds to MongoDB _id
  title: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
    _id: string;
  };
  creator: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  isFree: boolean;
  thumbnail?: string;
  category: TCategory;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  duration?: string;
  description?: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type TUser = {
  _id: string;
  posts: TContentItem[];
  email: string;
  lastName: string;
  firstName: string;
};

export type Tcontent = {
  type: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  originalPrice: string;
  price: string;
  estimatedDuration: string;
};

export type TPagination = {
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  limits: number;
};

export type TPriceCardProps = {
  price: number;
  duration: string;
  isRecommended?: boolean;
  remark?: string;
  currentlySelectedPlan: string;
  setCurrentlySelectedPlan: (plan: string) => void;
};

export type TComment = {
  list: TList[];
  pagination: TPagination;
};

type TList = {
  post: string;
  author: TUser;
  content: string;
  likes?: number;
  createdAt: string;
  updatedAt: string;
};
