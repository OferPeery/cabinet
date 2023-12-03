import React, { useState } from "react";
import { useRequest } from "ahooks";
import { Box, Checkbox, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import UsersPage from "../pages/UsersPage";
import { getManyUsersById } from "../services/usersService";
import { changeLikePost } from "../services/postsService";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getServerImageUrl } from "../services/imagesService";
import { showHttpErrorToast } from "../utils/toast";
import AppModal from "./Modal/AppModal";
import ModalTitle from "./Modal/ModalTitle";

const PostCard = ({
  post,
  initialIsLiked,
  onLikeChanged,
  currentUsername,
  currentUserProfileUrl,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const { likesAmount, likedByUsernames } = post;

  const { run: handleLikeChange } = useRequest(
    async () => {
      const changedLikePost = await changeLikePost(post._id, !isLiked);
      setIsLiked((isLiked) => !isLiked);
      onLikeChanged(changedLikePost);
    },
    {
      manual: true,
      onBefore: () => setIsLikeDisabled(true),
      onError: (e) =>
        showHttpErrorToast(e, "Failed to toggle like status of the post"),
      onFinally: () => setIsLikeDisabled(false),
    }
  );

  const computeLikesLabel = () => {
    if (likesAmount === 0) {
      return "No likes yet...";
    }

    const likesNoCurrentUsername = likedByUsernames.filter(
      (u) => u !== currentUsername
    );

    const firstLiker = isLiked ? "you" : `@${likesNoCurrentUsername[0]}`;
    if (likesAmount === 1) {
      return `Liked by: ${firstLiker}`;
    }

    const secondLiker = isLiked
      ? `@${likesNoCurrentUsername[0]}`
      : `@${likesNoCurrentUsername[1]}`;
    if (likesAmount === 2) {
      return `Liked by: ${firstLiker} and ${secondLiker}`;
    }

    const otherLikesAmount = likesAmount - 2;
    return `Liked by: ${firstLiker}, ${secondLiker} and ${otherLikesAmount} other${
      otherLikesAmount > 1 ? "s" : ""
    }`;
  };

  return (
    <Box>
      <Card elevation={6} sx={{ margin: 1, width: "50%", minWidth: 350 }}>
        <CardHeader
          avatar={
            <Avatar
              src={
                post.creatorUsername === currentUsername
                  ? getServerImageUrl(currentUserProfileUrl)
                  : getServerImageUrl(post.creatorProfileUrl)
              }
              sx={{ width: 45, height: 45 }}
            />
          }
          title={`@${post.creatorUsername}`}
          subheader={`🗓️ ${post.creationDate}, ${post.creationTime}`}
        />
        {post.imageUrl && (
          <CardMedia
            component="img"
            sx={{ maxHeight: "600" }}
            image={getServerImageUrl(post.imageUrl)}
          />
        )}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post.text}
          </Typography>
          <Divider
            orientation="horizontal"
            flexItem
            sx={{ width: "100%", marginTop: 2, marginBottom: 1 }}
          />
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="add to favorites"
            disabled={isLikeDisabled}
            onClick={handleLikeChange}
          >
            <Checkbox
              icon={<FavoriteBorder />}
              checked={isLiked}
              checkedIcon={<Favorite sx={{ color: "red" }} />}
            />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {computeLikesLabel()}
            {likesAmount !== 0 && (
              <IconButton onClick={() => setOpen(true)}>
                <OpenInNewIcon />
              </IconButton>
            )}
          </Typography>
        </CardActions>
      </Card>

      <AppModal
        open={open}
        onClose={() => setOpen(false)}
        maxHeight="none"
        minHeight="none"
      >
        <ModalTitle title="Likes:" />
        <UsersPage getUsersOp={() => getManyUsersById(post.likedBy)} />
      </AppModal>
    </Box>
  );
};

export default PostCard;
