/**
 * Test Setup File
 * 
 * Configures the testing environment with necessary mocks and extensions.
 * This file runs before each test to ensure a consistent testing environment.
 */
import '@testing-library/jest-dom';

/**
 * Mock the window.matchMedia function
 * 
 * Required for testing components that use media queries (like dark mode detection).
 * By default, returns matches: false for all queries.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock localStorage implementation
 * 
 * Provides an in-memory implementation of localStorage for tests.
 * Necessary for testing components that use localStorage (like dark mode preference).
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

/**
 * Apply the localStorage mock to the window object
 */
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
