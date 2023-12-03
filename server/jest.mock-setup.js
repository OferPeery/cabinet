import { mockServer, mockDb } from "./tests/mocks/index.js";

beforeAll(async () => {
  await mockServer.start();
});

afterAll(async () => {
  await mockServer.end();
});

beforeEach(() => {
  mockDb.initialize();
});

afterEach(() => {
  mockDb.destroy();
});
