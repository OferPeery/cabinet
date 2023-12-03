import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useContext } from "react";
import PostCard from "./PostCard";
import { getFeedByUserId } from "../services/postsService";
import { useRequest } from "ahooks";
import UserContext from "../context/UserContext";
import CreatePostModal from "./CreatePostModal";
import { showHttpErrorToast } from "../utils/toast";

const Feed = () => {
  const { currentUser } = useContext(UserContext);
  const {
    data: postList,
    loading,
    mutate: setPostList,
  } = useRequest(() => getFeedByUserId(currentUser._id), {
    onError: (e) => showHttpErrorToast(e, "Failed to fetch feed posts"),
  });

  const handlePostAdded = (addedPost) => {
    setPostList([addedPost, ...postList]);
  };

  const handleLikeChanged = (likedPost) => {
    const postIndex = postList.findIndex((post) => post._id === likedPost._id);
    const clonedPostList = [...postList];

    clonedPostList[postIndex] = likedPost;
    setPostList(clonedPostList);
  };

  return (
    <Box flex={4} p={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CreatePostModal onPostAdded={handlePostAdded} />
          {!postList.length ? (
            <Typography>No posts to show yet...</Typography>
          ) : (
            postList.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLikeChanged={handleLikeChanged}
                initialIsLiked={post.likedBy.includes(currentUser._id)}
                currentUsername={currentUser.username}
                currentUserProfileUrl={currentUser.profileUrl}
              />
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default Feed;
