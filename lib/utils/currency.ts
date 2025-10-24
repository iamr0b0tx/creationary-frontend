// Currency calculation utilities to handle floating point precision
export const currency = {
  add: (a: number, b: number): number => {
    return Math.round((a + b) * 100) / 100;
  },

  subtract: (a: number, b: number): number => {
    return Math.round((a - b) * 100) / 100;
  },

  multiply: (a: number, b: number): number => {
    return Math.round(a * b * 100) / 100;
  },

  divide: (a: number, b: number): number => {
    return Math.round((a / b) * 100) / 100;
  },
};
