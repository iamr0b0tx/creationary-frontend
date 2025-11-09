import { expect, vi, test, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ExplorePageComponent from "../app/(user)/explore/explorePageComponent";
import { mockContent } from "./integration/explore-flow.test";
import { mockPagination, mockPathnameValue, mockRouterInstance, mockSearchParamsValue } from "./test-utils";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouterInstance,
  usePathname: () => mockPathnameValue,
  useSearchParams: () => mockSearchParamsValue,
}));

// Clean up after each test to prevent duplicate elements
afterEach(() => {
  cleanup();
});

test("Explore Page renders without crashing", () => {
  const { container } = render(
    <ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />
  );
  expect(container).toBeDefined();
  expect(screen.getByText("Discover amazing content from talented creators")).toBeDefined();
});

test("Explore Page has main heading", () => {
  render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);
  const heading = screen.getByRole("heading", { name: /explore content/i });
  expect(heading.textContent).toBe("Explore Content");
});

test("Explore Page has search functionality", () => {
  render(<ExplorePageComponent pagination={mockPagination} initialContent={mockContent} />);
  const searchInput = screen.getByRole("textbox");
  expect(searchInput.getAttribute("placeholder")).toBe("Search content or creators...");
});
