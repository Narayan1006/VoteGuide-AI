// react-hot-toast CJS mock
module.exports = {
  default: jest.fn(),
  Toaster: () => null,
  success: jest.fn(),
  error:   jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  promise: jest.fn(),
};
