import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "../test-utils";
import { setupNextNavigation, mockFetchResponse, resetAllMocks } from "../test-utils";
import ExplorePageComponent from "@/app/(user)/explore/explorePageComponent";
import { TCategory } from "@/lib/types/types";

// Mock the data fetching function
vi.mock("@/lib/data/exploreContent", () => ({
  getContentData: vi.fn(),
  categories: ["All", "Photography", "Music", "Technology"],
}));

// Mock Next.js navigation
setupNextNavigation();

export const mockContent = [
  {
    _id: "1",
    title: "Photography Masterclass",
    description: "Learn professional photography techniques",
    price: 29.99,
    originalPrice: 39.99,
    category: "Photography" as TCategory,
    thumbnail: "/test-image.jpg",
    creator: {
      name: "John Photographer",
      username: "john-photo",
      avatar: "/avatar.jpg",
      verified: true,
    },
    author: "13234353",
    content:
      "This is valid content that is definitely long enough to pass the minimum requirements",
    isFree: false,
    rating: 4.5,
    reviews: 10,
    views: 100,
    likes: 50,
    duration: "2 hours",
    features: ["Camera Techniques", "Lighting Setup", "Post-Processing Tips"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "2",
    title: "Music Production Basics",
    description: "Start your music production journey",
    price: 19.99,
    originalPrice: null,
    category: "Music" as TCategory,
    thumbnail: "/test-music.jpg",
    creator: {
      name: "Jane Producer",
      username: "jane-music",
      avatar: "/avatar2.jpg",
      verified: false,
    },
    author: "13234353",
    content:
      "This is valid content that is definitely long enough to pass the minimum requirements",
    isFree: false,
    rating: 4.5,
    reviews: 10,
    views: 100,
    likes: 50,
    duration: "2 hours",
    features: ["Camera Techniques", "Lighting Setup", "Post-Processing Tips"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const mockPagination = {
  totalPages: 3,
  currentPage: 1,
  limits: 10,
  totalPosts: 25,
};

afterEach(() => {
  cleanup();
});

describe("Explore Page Integration", () => {
  beforeEach(() => {
    resetAllMocks();
    // Mock successful fetch
    global.fetch = mockFetchResponse({
      datacontent: {
        data: {
          posts: mockContent,
          pagination: mockPagination,
        },
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render content cards with correct information", () => {
    render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);

    // Check if content is displayed
    expect(screen.getByRole("heading", { name: "Explore Content" })).toBeInTheDocument();
    expect(screen.getByText("Music Production Basics")).toBeInTheDocument();

    expect(screen.getByText("₦29.99")).toBeInTheDocument();
    expect(screen.getByText("₦19.99")).toBeInTheDocument();

    // Check creator info
    expect(screen.getByText("John Photographer")).toBeInTheDocument();
    expect(screen.getByText("Jane Producer")).toBeInTheDocument();
  });

  it("should handle search functionality", async () => {
    render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);

    const searchInput = screen.getByPlaceholderText("Search content or creators...");

    fireEvent.change(searchInput, { target: { value: "photography" } });

    // Should update the input value
    expect(searchInput).toHaveValue("photography");
  });

  it("should filter by category", async () => {
    render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);

    // Find category buttons
    const photographyButton = screen.getByText("Photography");

    // Click category filter
    fireEvent.click(photographyButton);

    // Should have active state (check for active styling)
    await waitFor(() => {
      expect(photographyButton.closest("button")).toHaveClass("bg-primary");
    });
  });

  it("should handle pagination", () => {
    render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);

    // Should have next button enabled
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeInTheDocument();
  });

  //   it("should show empty state when no content", () => {
  //     render(
  //       <ExplorePageComponent pagination={{ ...mockPagination, totalPosts: 0 }} initialContent={[]} />
  //     );

  //     expect(screen.getByText("No content found")).toBeInTheDocument();
  //   });
});
