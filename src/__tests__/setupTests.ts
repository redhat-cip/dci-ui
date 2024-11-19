import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { server } from "__tests__/node";
import { beforeAll, afterEach, afterAll, vi } from "vitest";

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());

export const localStorageMock = (function () {
  let store: { [x: string]: string } = {};
  return {
    setItem: function (key: string, value: string) {
      store[key] = value || "";
    },
    getItem: function (key: string) {
      return key in store ? store[key] : null;
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key: function (i: number) {
      const keys = Object.keys(store);
      return keys[i] || null;
    },
    clear: function () {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  };
