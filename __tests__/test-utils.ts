import { vi } from "vitest";

// Test utilities and helpers for consistent testing across the app

// Mock factories for consistent test data
export const mockUser = {
  _id: "123",
  name: "Test User",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
};

export const mockPost = {
  _id: "456",
  title: "Test Post Title",
  description: "Test post description that is long enough to pass validation",
  content: "Test content that is definitely long enough to pass the minimum requirements",
  category: "Technology",
  price: 29.99,
  originalPrice: 39.99,
  features: ["Feature 1", "Feature 2"],
  author: mockUser,
};

export const mockPagination = {
  totalPages: 5,
  currentPage: 1,
  limits: 10,
  totalPosts: 50,
};

// Mock Next.js navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
};

export const mockSearchParams = new URLSearchParams("page=1");

// For use in individual test files - call at module top level, not in a function
export const mockRouterInstance = mockRouter;
export const mockPathnameValue = "/test-path";
export const mockSearchParamsValue = mockSearchParams;

// Mock fetch responses
export function mockFetchResponse(data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

// Reset all mocks between tests
export function resetAllMocks() {
  vi.clearAllMocks();
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
}

// Re-export everything from RTL with our custom render
export * from "@testing-library/react";
