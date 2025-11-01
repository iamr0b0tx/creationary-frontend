import { expect, test, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ExplorePageComponent from "../app/explore/explorePageComponent";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/explore",
  useSearchParams: () => ({
    get: (param: string) => {
      if (param === "page") return "1";
      return null;
    },
    has: vi.fn().mockReturnValue(false),
  }),
}));

const mockPagination = { totalPages: 0, currentPage: 0, limits: 0, totalPosts: 0 };

// Clean up after each test to prevent duplicate elements
afterEach(() => {
  cleanup();
});

test("Explore Page renders without crashing", () => {
  const { container } = render(
    <ExplorePageComponent pagination={mockPagination} initialContent={[]} />
  );
  expect(container).toBeDefined();
  expect(screen.getByText("Discover amazing content from talented creators")).toBeDefined();
});

test("Explore Page has main heading", () => {
  render(<ExplorePageComponent pagination={mockPagination} initialContent={[]} />);
  const heading = screen.getByRole("heading", { name: /explore content/i });
  expect(heading.textContent).toBe("Explore Content");
});

test("Explore Page has search functionality", () => {
  render(<ExplorePageComponent pagination={mockPagination} initialContent={[]} />);
  const searchInput = screen.getByRole("textbox");
  expect(searchInput.getAttribute("placeholder")).toBe("Search content or creators...");
});
