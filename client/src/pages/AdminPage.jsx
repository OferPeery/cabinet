import React, { useContext } from "react";
import { useRequest } from "ahooks";
import { getFeatureFlags } from "../services/featureFlagsService";
import { useFlagUpdater } from "../context/FeatureFlagsContext";
import { Box } from "@mui/system";
import FeatureFlag from "../components/FeatureFlag";
import { getActivityLog } from "../services/activityLogService";
import { Typography, Divider } from "@mui/material";
import ActivityLogTable from "../components/ActivityLogTable";
import { getAllUsers, removeUser } from "../services/usersService";
import UsersTable from "../components/UsersTable";
import { showHttpErrorToast } from "../utils/toast";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminPage = () => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser.isAdmin) {
    return <Navigate to="/home" />;
  }

  return (
    <Box
      flex={4}
      p={2}
      sx={{ display: "flex", flexDirection: "column", gap: "48px" }}
    >
      <Section title="Feature Flags">
        <FeatureFlags />
      </Section>
      <Divider />
      <Section title="Activity Log">
        <ActivityLog />
      </Section>
      <Divider />
      <Section title="Users">
        <Users />
      </Section>
    </Box>
  );
};

const Section = ({ title, children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Typography component={"h1"} fontSize={"24px"}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

const FeatureFlags = () => {
  const { data: flags, mutate } = useRequest(getFeatureFlags, {
    onError: (e) => showHttpErrorToast(e, "Failed to fetch feature flags"),
  });
  const updateFlag = useFlagUpdater();

  const handleChange = async (flagId, value) => {
    const updatedFlag = await updateFlag(flagId, value);
    mutate(flags.map((flag) => (flag._id === flagId ? updatedFlag : flag)));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {flags?.map((flag) => (
        <FeatureFlag
          key={flag._id}
          flag={flag}
          onChange={(newValue) => handleChange(flag._id, newValue)}
        />
      ))}
    </Box>
  );
};

const ActivityLog = () => {
  const { data: activityLog } = useRequest(getActivityLog, {
    onError: (e) => showHttpErrorToast(e, "Failed to fetch activity log"),
  });

  return <ActivityLogTable activityLog={activityLog} />;
};

const Users = () => {
  const { data: users, mutate } = useRequest(getAllUsers, {
    onError: (e) => showHttpErrorToast(e, "Failed to fetch all users"),
  });
  const { run: deleteUser } = useRequest(removeUser, {
    manual: true,
    onError: (e) => showHttpErrorToast(e, "Failed to delete user"),
    onSuccess: (_, [_id]) =>
      mutate([...users].filter((user) => user._id !== _id)),
  });

  return <UsersTable users={users} onDelete={({ _id }) => deleteUser(_id)} />;
};

export default AdminPage;
