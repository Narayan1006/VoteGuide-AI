// Gemini API mock
const mockSendMessage = jest.fn(() => Promise.resolve({
  response: { text: () => 'Mock AI response for testing.' },
}));
const mockGenerateContent = jest.fn(() => Promise.resolve({
  response: { text: () => 'Mock AI content.' },
}));
const mockStartChat = jest.fn(() => ({
  sendMessage: mockSendMessage,
}));
const mockGetGenerativeModel = jest.fn(() => ({
  startChat:       mockStartChat,
  generateContent: mockGenerateContent,
}));

class MockGoogleGenerativeAI {
  constructor() {}
  getGenerativeModel() { return mockGetGenerativeModel(); }
}

module.exports = {
  GoogleGenerativeAI: MockGoogleGenerativeAI,
};
