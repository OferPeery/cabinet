import { faker } from "@faker-js/faker";
import { createMockUser, createMockPost } from "./mocks/mockEntities";
import { createApi } from "./utils/api";
import { db } from "./utils/db";

describe("auth routes", () => {
  describe("POST /api/auth/register", () => {
    test("should register new user successfully", async () => {
      const api = createApi();
      const user = createMockUser();

      const response = await api.registerNewUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isRememberMe: true,
        password: "a1234",
      });

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        _id: expect.any(String),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        airline: "",
        position: "",
        profileUrl: "",
        isAdmin: false,
        isDarkMode: false,
      });
      expect(response.headers.get("set-cookie")).toBeDefined();
    });

    test("should fail to register new user if username already exists", async () => {
      const existingUser = db.insertUser();
      const api = createApi();
      const user = createMockUser();

      const response = await api.registerNewUser({
        username: existingUser.username, // We used the same username
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isRememberMe: true,
        password: "a5678",
      });

      expect(response.status).toBe(400);
      expect(response.headers.get("set-cookie")).toBeNull();
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login user successfully", async () => {
      const api = createApi();
      const user = createMockUser();
      const password = "a1234";

      await api.registerNewUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isRememberMe: true,
        password,
      });

      const response = await api.loginUser({
        username: user.username,
        isRememberMe: true,
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        _id: expect.any(String),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        airline: "",
        position: "",
        profileUrl: "",
        isAdmin: false,
        isDarkMode: false,
      });
      expect(response.headers.get("set-cookie")).toBeDefined();
    });

    test("should fail to login user if wasn't registered", async () => {
      const api = createApi();
      const user = createMockUser();

      const response = await api.loginUser({
        username: user.username,
        isRememberMe: true,
        password: "a1234",
      });

      expect(response.status).toBe(401);
      expect(response.headers.get("set-cookie")).toBeNull();
    });

    test("should fail to login user if its password is incorrect", async () => {
      const api = createApi();
      const user = createMockUser();

      await api.registerNewUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isRememberMe: true,
        password: "a1234",
      });

      const response = await api.loginUser({
        username: user.username,
        isRememberMe: true,
        password: "wrongPassword",
      });

      expect(response.status).toBe(401);
      expect(response.headers.get("set-cookie")).toBeNull();
    });

    test("should log activity when user reguster and login", async () => {
      const user = createMockUser();
      const password = "a1234";
      await createApi().registerNewUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isRememberMe: true,
        password,
      });
      await createApi().loginUser({
        username: user.username,
        isRememberMe: true,
        password,
      });

      const adminUser = db.insertUser({ isAdmin: true });
      const api = createApi(adminUser);

      const response = await api.getActivityLog();

      expect(response.body).toStrictEqual([
        {
          _id: expect.any(String),
          timestamp: expect.any(Number),
          activityType: "register",
          username: user.username,
        },
        {
          _id: expect.any(String),
          timestamp: expect.any(Number),
          activityType: "login",
          username: user.username,
        },
      ]);
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout user successfully", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.logoutUser();

      expect(response.status).toBe(200);
    });
  });
});

describe("users routes", () => {
  describe("GET /api/users", () => {
    test("should get all users successfully", async () => {
      const [user1, user2] = db.insertUsers([{}, {}]);
      const api = createApi(user1);

      const response = await api.getUsers();

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        [user1, user2].map((user) => ({
          _id: expect.any(String),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          airline: "",
          position: "",
          profileUrl: "",
          isAdmin: false,
          isDarkMode: false,
        }))
      );
    });
  });

  describe("GET /api/users/:id", () => {
    test("should get a specific user successfully", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.getUser(user._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        _id: expect.any(String),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        airline: "",
        position: "",
        profileUrl: "",
        isAdmin: false,
        isDarkMode: false,
      });
    });

    test("should fail to get a specific user if doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      // we use an id that doesn't exist
      const response = await api.getUser(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/users/many", () => {
    test("should get specific users successfully", async () => {
      const [user, _] = db.insertUsers([{}, {}]);
      const api = createApi(user);

      const response = await api.getManyUsers([user._id]);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([
        {
          _id: expect.any(String),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          airline: "",
          position: "",
          profileUrl: "",
          isAdmin: false,
          isDarkMode: false,
        },
      ]);
    });

    test("should fail to get specific users if ids weren't provided", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.getManyUsers([]);

      expect(response.status).toBe(422);
    });
  });

  describe("PUT /api/users/:id", () => {
    test("should update a specific user successfully", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const userUpdatedDetails = {
        isDarkMode: true,
        firstName: "Moshe",
        lastName: "Rabenu",
        email: "har@sinai.eg",
        profileUrl: "http://www.golden-calf.com/selfie.jpg",
        airline: "GOD",
        position: "prophet",
      };

      const response = await api.updateUser(user._id, userUpdatedDetails);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        _id: expect.any(String),
        isAdmin: false,
        username: user.username,
        ...userUpdatedDetails,
      });
    });

    test("should fail to update a specific user to admin role", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.updateUser(user._id, { isAdmin: true });

      expect(response.status).toBe(422);
    });

    test("should fail to update a specific user that doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.updateUser(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0",
        { firstName: "Simba" }
      );

      expect(response.status).toBe(404);
    });

    test("should fail to update other user if you're not an admin", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const api = createApi(currentUser);

      const response = await api.updateUser(otherUser._id, {
        firstName: "Shoshana",
      });

      expect(response.status).toBe(403);
    });

    test("should update other user successfully if you're an admin", async () => {
      const [currentUser, otherUser] = db.insertUsers([{ isAdmin: true }, {}]);
      const api = createApi(currentUser);

      const response = await api.updateUser(otherUser._id, {
        firstName: "Shoshana",
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/users/follow", () => {
    test("should follow other user successfully", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const api = createApi(currentUser);

      const response = await api.followUser(otherUser._id);

      expect(response.status).toBe(200);
    });

    test("should fail to follow yourself", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.followUser(user._id);

      expect(response.status).toBe(400);
    });

    test("should fail to follow a user that doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.followUser(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });

    test("should fail to follow a user that you already following", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.followUser(otherUser._id);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/users/unfollow", () => {
    test("should unfollow other user successfully", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.unfollowUser(otherUser._id);

      expect(response.status).toBe(200);
    });

    test("should fail to unfollow yourself", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.unfollowUser(user._id);

      expect(response.status).toBe(400);
    });

    test("should fail to unfollow a user that doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.unfollowUser(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });

    test("should fail to unfollow a user that isn't being followed", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const api = createApi(currentUser);

      const response = await api.unfollowUser(otherUser._id);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/users/:id/followers", () => {
    test("should get user's followers successfully", async () => {
      const [currentUser, followerUser] = db.insertUsers([{}, {}]);
      db.insertFollowing(followerUser._id, currentUser._id);
      const api = createApi(currentUser);

      const response = await api.getFollowers(currentUser._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([followerUser._id]);
    });

    test("should fail to get user's followers if user doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.getFollowers(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/users/:id/followees", () => {
    test("should get user's followees successfully", async () => {
      const [currentUser, followeeUser] = db.insertUsers([{}, {}]);
      db.insertFollowing(currentUser._id, followeeUser._id);
      const api = createApi(currentUser);

      const response = await api.getFollowees(currentUser._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([followeeUser._id]);
    });

    test("should fail to get user's followees if user doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.getFollowees(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    test("should remove user successfully if you're admin", async () => {
      const [adminUser, regularUser] = db.insertUsers([{ isAdmin: true }, {}]);
      const api = createApi(adminUser);

      const response = await api.removeUser(regularUser._id);

      expect(response.status).toBe(200);
    });

    test("should fail to remove user if you're not admin", async () => {
      const [user1, user2] = db.insertUsers([{}, {}]);
      const api = createApi(user1);

      const response = await api.removeUser(user2._id);

      expect(response.status).toBe(403);
    });
  });
});

describe("feature flags routes", () => {
  describe("GET /api/feature-flags", () => {
    test("should get all feature flags if you're an admin", async () => {
      const adminUser = db.insertUser({ isAdmin: true });
      const featureFlag = db.insertFeatureFlag();
      const api = createApi(adminUser);

      const response = await api.getFeatureFlags();

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([featureFlag]);
    });

    test("should fail to get all feature flags if you're not an admin", async () => {
      const regularUser = db.insertUser();
      db.insertFeatureFlag();
      const api = createApi(regularUser);

      const response = await api.getFeatureFlags();

      expect(response.status).toBe(403);
    });
  });

  describe("PUT /api/feature-flags/:id", () => {
    test("should update feature flag", async () => {
      const adminUser = db.insertUser({ isAdmin: true });
      const featureFlag = db.insertFeatureFlag();
      const api = createApi(adminUser);
      const updatedValue = !featureFlag.value;

      const response = await api.updateFeatureFlag(
        featureFlag._id,
        updatedValue
      );

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        ...featureFlag,
        value: updatedValue,
      });
    });

    test("should fail to update feature flag if not admin", async () => {
      const regularUser = db.insertUser();
      const featureFlag = db.insertFeatureFlag();
      const api = createApi(regularUser);

      const response = await api.updateFeatureFlag(featureFlag._id, true);

      expect(response.status).toBe(403);
    });

    test("should fail to update feature flag doesn't exist", async () => {
      const adminUser = db.insertUser({ isAdmin: true });
      const api = createApi(adminUser);

      const response = await api.updateFeatureFlag(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0",
        true
      );

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/feature-flags/values", () => {
    test("should get feature flags values", async () => {
      const regularUser = db.insertUser();
      const featureFlag = db.insertFeatureFlag();
      const api = createApi(regularUser);

      const response = await api.getFeatureFlagsValues();

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        [featureFlag.key]: featureFlag.value,
      });
    });
  });
});

describe("posts routes", () => {
  describe("GET /api/posts/feed", () => {
    test("should get the feed posts successfully", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const [currentUserPost, otherUserPost] = db.insertPosts([
        { creatorId: currentUser._id },
        { creatorId: otherUser._id },
        {},
      ]);
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.getFeedPosts(currentUser._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([
        {
          ...otherUserPost,
          creationDate: expect.any(String),
          creationTime: expect.any(String),
          creatorProfileUrl: otherUser.profileUrl,
          creatorUsername: otherUser.username,
          likedByUsernames: [],
          likesAmount: 0,
        },
        {
          ...currentUserPost,
          creationDate: expect.any(String),
          creationTime: expect.any(String),
          creatorProfileUrl: currentUser.profileUrl,
          creatorUsername: currentUser.username,
          likedByUsernames: [],
          likesAmount: 0,
        },
      ]);
    });

    test("should fail to get feed posts if userId wasn't provided", async () => {
      const user = db.insertUser();
      db.insertPost({ creatorId: user._id });
      const api = createApi(user);

      const response = await api.getFeedPosts();

      expect(response.status).toBe(422);
    });
  });

  describe("POST /api/posts", () => {
    test("should create a new post successfully", async () => {
      const user = db.insertUser();
      const api = createApi(user);
      const { text, imageUrl } = createMockPost();

      const response = await api.createPost({
        text,
        imageUrl,
      });

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        _id: expect.any(String),
        timestamp: expect.any(Number),
        creationDate: expect.any(String),
        creationTime: expect.any(String),
        creatorId: user._id,
        creatorProfileUrl: user.profileUrl,
        creatorUsername: user.username,
        text,
        imageUrl,
        likedByUsernames: [],
        likedBy: [],
        likesAmount: 0,
      });
    });

    test("should fail to create a new post if text is too long", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.createPost({
        text: faker.lorem.word({ length: { min: 301 } }),
      });

      expect(response.status).toBe(422);
    });

    test("should login activity when user creates a new post", async () => {
      const user = db.insertUser();
      const { text, imageUrl } = createMockPost();
      await createApi(user).createPost({
        text,
        imageUrl,
      });

      const adminUser = db.insertUser({ isAdmin: true });
      const api = createApi(adminUser);

      const response = await api.getActivityLog();

      expect(response.body).toStrictEqual([
        {
          _id: expect.any(String),
          timestamp: expect.any(Number),
          activityType: "post",
          username: user.username,
        },
      ]);
    });
  });

  describe("POST /api/posts/:id/like", () => {
    test("should be able to like post successfully", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const otherUserPost = db.insertPost({ creatorId: otherUser._id });
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.likePost(otherUserPost._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        ...otherUserPost,
        creationDate: expect.any(String),
        creationTime: expect.any(String),
        creatorProfileUrl: otherUser.profileUrl,
        creatorUsername: otherUser.username,
        likedByUsernames: [currentUser.username],
        likedBy: [currentUser._id],
        likesAmount: 1,
      });
    });

    test("should fail to like post that doesn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.likePost(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });

    test("should fail to like post that you already like", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const otherUserPost = db.insertPost({
        creatorId: otherUser._id,
        likedBy: [currentUser._id],
        likesAmount: 1,
      });
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.likePost(otherUserPost._id);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/posts/:id/unlike", () => {
    test("should be able to unlike post successfully", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const otherUserPost = db.insertPost({
        creatorId: otherUser._id,
        likedBy: [currentUser._id],
        likesAmount: 1,
      });
      const api = createApi(currentUser);

      const response = await api.unlikePost(otherUserPost._id);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        ...otherUserPost,
        creationDate: expect.any(String),
        creationTime: expect.any(String),
        creatorProfileUrl: otherUser.profileUrl,
        creatorUsername: otherUser.username,
        likedByUsernames: [],
        likedBy: [],
        likesAmount: 0,
      });
    });

    test("should fail to unlike post that deosn't exist", async () => {
      const user = db.insertUser();
      const api = createApi(user);

      const response = await api.unlikePost(
        "dbd720e4-7883-4108-89d8-96cdaf60feb0"
      );

      expect(response.status).toBe(404);
    });

    test("should fail to unlike post that you don't like", async () => {
      const [currentUser, otherUser] = db.insertUsers([{}, {}]);
      const otherUserPost = db.insertPost({
        creatorId: otherUser._id,
        likedBy: [],
        likesAmount: 0,
      });
      db.insertFollowing(currentUser._id, otherUser._id);
      const api = createApi(currentUser);

      const response = await api.unlikePost(otherUserPost._id);

      expect(response.status).toBe(400);
    });
  });
});

describe("activity logs routes", () => {
  describe("GET /api/activity-logs", () => {
    test("should get all activity logs successfully if you're an admin", async () => {
      const adminUser = db.insertUser({ isAdmin: true });
      const activityLog = db.insertActivityLog();
      const api = createApi(adminUser);

      const response = await api.getActivityLog();

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([activityLog]);
    });

    test("should fail to get all activity logs if you're not an admin", async () => {
      const regularUser = db.insertUser();
      const activityLog = db.insertActivityLog();
      const api = createApi(regularUser);

      const response = await api.getActivityLog();

      expect(response.status).toBe(403);
    });
  });
});

describe("static routes", () => {
  describe("GET /readme.html", () => {
    test("should get readme.html file successfully", async () => {
      const api = createApi();

      const response = await api.getReadme();

      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});
