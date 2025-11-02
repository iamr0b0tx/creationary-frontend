import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Page from "../components/top-nav";

const mockUser = {
  _id: "123",
  name: "Test User",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
};

describe("Top Nav", () => {
  test("renders navigation links", () => {
    render(<Page user={mockUser} />);
    expect(screen.getAllByRole("link", { name: /Explore/i })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /Pricing/i })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /About/i })).toBeDefined();
  });
});
