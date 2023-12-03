import { faker } from "@faker-js/faker";

const createUsername = () =>
  faker.string.alphanumeric({ length: { min: 3, max: 30 } });

export const createMockUser = (overrides = {}) => {
  return {
    isAdmin: false,
    isDarkMode: false,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: createUsername(),
    email: faker.internet.email(),
    profileUrl: "",
    airline: "",
    position: "",
    ...overrides,
  };
};

export const createMockFeatureFlag = (overrides = {}) => {
  return {
    key: faker.company.buzzPhrase().replaceAll(" ", "_"),
    description: faker.lorem.sentence(),
    value: true,
    ...overrides,
  };
};

export const createMockPost = (overrides = {}) => {
  return {
    creatorId: faker.string.uuid(),
    timestamp: new Date().getTime(),
    imageUrl: "",
    text: faker.lorem.paragraph(),
    likedBy: [],
    ...overrides,
  };
};

export const createMockActivityLog = (overrides = {}) => {
  return {
    username: createUsername(),
    activityType: faker.helpers.arrayElement(["register", "login", "post"]),
    timestamp: new Date().getTime(),
    ...overrides,
  };
};
