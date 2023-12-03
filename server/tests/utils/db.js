import { v4 as uuidv4 } from "uuid";
import { mockDb } from "../mocks";
import {
  createMockUser,
  createMockPost,
  createMockFeatureFlag,
  createMockActivityLog,
} from "../mocks/mockEntities";

const insertEntity = (name, value) => {
  const entity = {
    _id: uuidv4(),
    ...value,
  };
  mockDb.insert(name, entity);

  return entity;
};

const insertUser = (overrides = {}) =>
  insertEntity("users", createMockUser(overrides));

const insertUsers = (overrides = []) => overrides.map(insertUser);

const insertPost = (overrides = {}) =>
  insertEntity("posts", createMockPost(overrides));

const insertPosts = (overrides = []) => overrides.map(insertPost);

const insertFollowing = (followerId, followeeId) =>
  insertEntity("followings", { followerId, followeeId });

const insertFeatureFlag = (overrides = {}) =>
  insertEntity("feature-flags", createMockFeatureFlag(overrides));

const insertActivityLog = (overrides = {}) =>
  insertEntity("activity-log", createMockActivityLog(overrides));

export const db = Object.freeze({
  insertUser,
  insertUsers,
  insertPost,
  insertPosts,
  insertFollowing,
  insertFeatureFlag,
  insertActivityLog,
});
