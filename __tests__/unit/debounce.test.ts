import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce, useDebounceCallback } from "@/lib/hooks/debounce";

// Mock timers for precise control over debounce timing
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 300 },
    });

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 300 });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward time but not enough
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Fast forward past the delay
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "initial" },
    });

    // Multiple rapid changes
    rerender({ value: "change1" });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: "change2" });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: "final" });

    // Should still be initial since timer keeps resetting
    expect(result.current).toBe("initial");

    // After full delay, should show final value
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("final");
  });
});

describe("useDebounceCallback", () => {
  it("should debounce function calls", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounceCallback(mockFn, 300));

    // Call the debounced function multiple times
    act(() => {
      result.current("arg1");
      result.current("arg2");
      result.current("arg3");
    });

    // Function should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should be called only once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg3");
  });

  it("should handle async callbacks", () => {
    const mockAsyncFn = vi.fn().mockResolvedValue("success");
    const { result } = renderHook(() => useDebounceCallback(mockAsyncFn, 300));

    act(() => {
      result.current("async-arg");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockAsyncFn).toHaveBeenCalledWith("async-arg");
  });

  it("should clean up timers on unmount", () => {
    const mockFn = vi.fn();
    const { result, unmount } = renderHook(() => useDebounceCallback(mockFn, 300));

    act(() => {
      result.current("test");
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Function should not be called after unmount
    expect(mockFn).not.toHaveBeenCalled();
  });
});
