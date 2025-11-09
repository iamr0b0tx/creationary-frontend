import { describe, it, expect } from "vitest";
import { currency } from "@/lib/utils/currency";

describe("Currency Utils", () => {
  describe("add", () => {
    it("should add two numbers correctly", () => {
      expect(currency.add(10.1, 20.2)).toBe(30.3);
      expect(currency.add(0.1, 0.2)).toBe(0.3); // Classic JS floating point issue
    });

    it("should handle negative numbers", () => {
      expect(currency.add(-10, 5)).toBe(-5);
      expect(currency.add(-10, -5)).toBe(-15);
    });

    it("should handle zero values", () => {
      expect(currency.add(0, 0)).toBe(0);
      expect(currency.add(10, 0)).toBe(10);
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers correctly", () => {
      expect(currency.subtract(30.3, 10.1)).toBe(20.2);
      expect(currency.subtract(0.3, 0.1)).toBe(0.2);
    });

    it("should handle negative results", () => {
      expect(currency.subtract(5, 10)).toBe(-5);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers correctly", () => {
      expect(currency.multiply(10.5, 2)).toBe(21);
      expect(currency.multiply(0.1, 3)).toBe(0.3);
    });

    it("should handle fractional multiplications", () => {
      expect(currency.multiply(29.99, 1.5)).toBe(44.99);
    });
  });

  describe("divide", () => {
    it("should divide two numbers correctly", () => {
      expect(currency.divide(21, 2)).toBe(10.5);
      expect(currency.divide(0.3, 3)).toBe(0.1);
    });

    it("should handle division resulting in fractions", () => {
      expect(currency.divide(100, 3)).toBe(33.33);
    });

    it("should handle division by 1", () => {
      expect(currency.divide(29.99, 1)).toBe(29.99);
    });
  });
});
