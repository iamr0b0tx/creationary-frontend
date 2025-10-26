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
}));

// Clean up after each test to prevent duplicate elements
afterEach(() => {
  cleanup();
});

test("Explore Page renders without crashing", () => {
  const { container } = render(<ExplorePageComponent initialContent={[]} />);
  expect(container).toBeDefined();
  expect(screen.getByText("Discover amazing content from talented creators")).toBeDefined();
});

test("Explore Page has main heading", () => {
  render(<ExplorePageComponent initialContent={[]} />);
  const heading = screen.getByRole("heading", { name: /explore content/i });
  expect(heading.textContent).toBe("Explore Content");
});

test("Explore Page has search functionality", () => {
  render(<ExplorePageComponent initialContent={[]} />);
  const searchInput = screen.getByRole("textbox");
  expect(searchInput.getAttribute("placeholder")).toBe("Search content or creators...");
});
