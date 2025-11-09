import { expect, test, vi, describe, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "../app/(user)/HomepageComponent";
import { mockPathnameValue, mockRouterInstance, mockSearchParamsValue } from "./test-utils";

// NOTE: Use this pattern in your test files:
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouterInstance,
  usePathname: () => mockPathnameValue,
  useSearchParams: () => mockSearchParamsValue,
}));

// Clean up after each test to prevent duplicate elements
afterEach(() => {
  cleanup();
});

const mockFeaturedContent = [
  {
    _id: "1",
    title: "Photography Masterclass",
    description: "Learn professional photography techniques",
    price: 29.99,
    originalPrice: 39.99,
    category: "Photography" as const,
    thumbnail: "/test-image.jpg",
    creator: {
      name: "John Photographer",
      username: "john-photo",
      avatar: "/avatar.jpg",
      verified: true,
    },
    isFree: false,
    rating: 4.5,
    reviews: 100,
    views: 1000,
    likes: 500,
    duration: "2 hours",
    features: [
      "In-depth video tutorials",
      "Downloadable resources",
      "Access to a private community",
    ],
    content: "this is the content",
    author: "13234353",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

describe("Home Page", () => {
  test("renders the main heading with brand name", () => {
    render(<Page featuredContent={mockFeaturedContent} />);
    expect(screen.getAllByText("Creationary")).toBeDefined();
  });

  test("renders the hero heading", () => {
    render(<Page featuredContent={mockFeaturedContent} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.getByText(/Monetize Your/i)).toBeDefined();
    expect(screen.getByText(/Creative Content/i)).toBeDefined();
  });

  test("renders call-to-action buttons", () => {
    render(<Page featuredContent={mockFeaturedContent} />);
    expect(screen.getByText("Start Creating")).toBeDefined();
    expect(screen.getByText("Browse Content")).toBeDefined();
  });

  test("renders Featured Creators section", () => {
    render(<Page featuredContent={mockFeaturedContent} />);
    expect(screen.getByText("Featured Creators")).toBeDefined();
  });

  // test("renders authentication links", () => {
  //   render(<Page />);
  //   expect(screen.getByText("Get Started")).toBeDefined();
  // });
});
