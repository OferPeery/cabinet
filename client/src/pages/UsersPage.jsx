import React, { useContext, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useRequest } from "ahooks";
import { getFollowees } from "../services/usersService";
import UserCard from "../components/UserCard";
import Search from "../components/Search";
import UserContext from "../context/UserContext";
import { airlines } from "../utils/airlines";
import { showHttpErrorToast } from "../utils/toast";

const getUsersList = async (currentUserId, getUsersOp) => {
  const [users, followees] = await Promise.all([
    getUsersOp(),
    getFollowees(currentUserId),
  ]);

  return users.map((user) => ({
    ...user,
    isFollowing: followees?.includes(user._id),
    airlineInfo: airlines.find((airline) => user.airline === airline.name),
  }));
};

const UsersPage = ({ getUsersOp }) => {
  const { currentUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: usersList,
    mutate,
    loading,
  } = useRequest(() => getUsersList(currentUser._id, getUsersOp), {
    onError: (e) => showHttpErrorToast(e, "Failed to fetch users"),
  });

  const handleFollowChange = (userId) => {
    mutate(
      usersList.map((u) =>
        u._id === userId ? { ...u, isFollowing: !u.isFollowing } : u
      )
    );
  };

  const filterUsers = () => {
    return searchQuery
      ? usersList.filter((user) =>
          user.username.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      : usersList;
  };

  let usersToShow = usersList;
  if (!loading) {
    usersToShow = filterUsers();
  }

  return (
    <Box flex={4} p={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Search
            sx={{ marginBottom: "10px" }}
            value={searchQuery}
            onChange={(query) => setSearchQuery(query)}
          />
          {usersToShow.length === 0 && (
            <Typography>No users to show...</Typography>
          )}
          {usersToShow?.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              isFollowing={user.isFollowing}
              onFollowChange={() => handleFollowChange(user._id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UsersPage;
