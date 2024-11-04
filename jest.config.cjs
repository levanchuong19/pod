module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    '^.+\\.scss$': 'jest-transform-stub', // Để xử lý tệp SCSS
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Mock CSS modules
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Thêm các phần mở rộng tệp cần thiết
};
