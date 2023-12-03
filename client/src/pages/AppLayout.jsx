import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useRequest } from "ahooks";
import { Box, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import PlaneLoader from "../components/PlaneLoader";
import { FeatureFlagsContext } from "../context/FeatureFlagsContext";
import { showHttpErrorToast } from "../utils/toast";

const AppLayout = () => {
  const { currentUser, refetchUser } = useContext(UserContext);
  const [userLoaded, setUserLoaded] = useState(!!currentUser);
  const { loaded: flagsLoaded } = useContext(FeatureFlagsContext);

  const { run: getCurrentUser } = useRequest(refetchUser, {
    manual: true,
    onError: (e) => showHttpErrorToast(e, "Failed to fetch current user"),
    onSuccess: () => setUserLoaded(true),
  });

  useEffect(() => {
    if (currentUser) {
      return;
    }

    new Promise((res) => setTimeout(res, 1500)).then(getCurrentUser);
  }, [currentUser, getCurrentUser]);

  if (!userLoaded || !flagsLoaded) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PlaneLoader />
        <ToastContainer position="bottom-right" theme="colored" closeOnClick />
      </div>
    );
  }

  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      sx={{ minHeight: "100%" }}
    >
      <Navbar />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ flex: 1 }}
      >
        <Sidebar />
        <Box marginLeft={"250px"}>
          <Outlet />
        </Box>
      </Stack>
      <ToastContainer position="bottom-right" theme="colored" closeOnClick />
    </Box>
  );
};

export default AppLayout;
