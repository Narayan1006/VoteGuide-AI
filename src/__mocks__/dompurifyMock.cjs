// DOMPurify CJS mock
module.exports = {
  sanitize: jest.fn((input) => input), // Return input as-is for testing
  default: {
    sanitize: jest.fn((input) => input),
  },
};
