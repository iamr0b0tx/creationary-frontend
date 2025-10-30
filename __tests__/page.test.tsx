import { expect, test, describe, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "../app/HomepageComponent";

// Clean up after each test to prevent duplicate elements
afterEach(() => {
  cleanup();
});

const mockUser = {
  id: "123",
  name: "Test User",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
};

describe("Home Page", () => {
  test("renders the main heading with brand name", () => {
    render(<Page user={mockUser} />);
    expect(screen.getAllByText("Creationary")).toBeDefined();
  });

  test("renders the hero heading", () => {
    render(<Page user={mockUser}  />);
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.getByText(/Monetize Your/i)).toBeDefined();
    expect(screen.getByText(/Creative Content/i)).toBeDefined();
  });

  test("renders call-to-action buttons", () => {
    render(<Page user={mockUser} />);
    expect(screen.getByText("Start Creating")).toBeDefined();
    expect(screen.getByText("Browse Content")).toBeDefined();
  });

  test("renders navigation links", () => {
    render(<Page user={mockUser} />);
    expect(screen.getAllByRole("link", { name: /Explore/i })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /Pricing/i })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /About/i })).toBeDefined();
  });

  test("renders Featured Creators section", () => {
    render(<Page user={mockUser} />);
    expect(screen.getByText("Featured Creators")).toBeDefined();
  });

  // test("renders authentication links", () => {
  //   render(<Page />);
  //   expect(screen.getByText("Get Started")).toBeDefined();
  // });
});
