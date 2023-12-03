import React, { useContext, useState } from "react";
import { useRequest } from "ahooks";
import { Avatar, Stack, Typography, styled, Grid, Button } from "@mui/material";
import UserContext from "../context/UserContext";
import { followRequest, unfollowRequest } from "../services/usersService";
import { showHttpErrorToast } from "../utils/toast";
import { getServerImageUrl } from "../services/imagesService";
import { airlines } from "../utils/airlines";
import AirlineLogo from "./AirlineLogo";

const UserBox = styled(Grid)({
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
  marginTop: "10px",
  minWidth: 550,
});

const RoundButton = styled(Button)({
  borderRadius: 20,
});

const FollowingButton = ({ ...rest }) => {
  const [buttonColor, setButtonColor] = useState("primary");
  const [label, setLabel] = useState("Following");

  const handleMouseHover = () => {
    setButtonColor("error");
    setLabel("unfollow");
  };

  const handleMouseLeave = () => {
    setButtonColor("primary");
    setLabel("Following");
  };

  return (
    <RoundButton
      {...rest}
      variant="outlined"
      onMouseOver={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      color={buttonColor}
    >
      {label}
    </RoundButton>
  );
};

const FollowButton = ({ ...rest }) => {
  return (
    <RoundButton {...rest} variant="contained">
      Follow
    </RoundButton>
  );
};

const UserCard = ({ user, isFollowing, onFollowChange }) => {
  const { currentUser } = useContext(UserContext);

  const { run: unfollowUser } = useRequest(
    async () => {
      await unfollowRequest(user._id);
      await onFollowChange();
    },
    {
      manual: true,
      onError: (e) => showHttpErrorToast(e, "Failed to unfollow user"),
    }
  );

  const { run: followUser } = useRequest(
    async () => {
      await followRequest(user._id);
      await onFollowChange();
    },
    {
      manual: true,
      onError: (e) => showHttpErrorToast(e, "Failed to follow user"),
    }
  );

  const getCurrentUserAirlineInfo = () =>
    airlines.find((airline) => airline.name === currentUser.airline);

  return (
    <UserBox container>
      <Grid item xs={1}>
        <Avatar
          src={
            user._id === currentUser._id
              ? getServerImageUrl(currentUser.profileUrl)
              : getServerImageUrl(user.profileUrl)
          }
          sx={{ width: 45, height: 45 }}
        />
      </Grid>
      <Grid item xs={8} sx={{ width: "100%" }}>
        <Stack direction="column">
          <Typography fontWeight={500} variant="span">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography fontWeight={300}>@{user?.username}</Typography>
          <Typography variant="p" fontWeight={100}>
            <AirlineLogo
              src={
                user._id === currentUser._id
                  ? getCurrentUserAirlineInfo()?.logoUrl
                  : user?.airlineInfo?.logoUrl
              }
            />
            {`${
              user._id === currentUser._id ? currentUser.airline : user?.airline
            } ✈ ${
              user._id === currentUser._id
                ? currentUser.position
                : user?.position
            }`}
          </Typography>
        </Stack>
      </Grid>
      {currentUser?._id !== user._id && (
        <Grid item xs={2.5}>
          {isFollowing ? (
            <FollowingButton onClick={unfollowUser} />
          ) : (
            <FollowButton onClick={followUser} />
          )}
        </Grid>
      )}
    </UserBox>
  );
};

export default UserCard;
