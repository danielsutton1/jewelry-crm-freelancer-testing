// Jest setup file for challenge testing
// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific log levels during tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
