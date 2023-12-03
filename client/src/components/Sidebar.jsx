import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CampaignIcon from "@mui/icons-material/Campaign";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QuizIcon from "@mui/icons-material/Quiz";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import UserContext from "../context/UserContext";
import { FeatureFlagsContext } from "../context/FeatureFlagsContext";
import { useRequest } from "ahooks";
import { showHttpErrorToast } from "../utils/toast";

const SideBarButton = ({ path, label, currentPath, icon: Icon }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={path}
        selected={currentPath === path}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

const Sidebar = () => {
  const { handleLogout } = useContext(UserContext);
  const { pathname } = useLocation();
  const buttons = useSidebarButtons();

  const { run: logout } = useRequest(handleLogout, {
    manual: true,
    onError: (e) => showHttpErrorToast(e, "Failed to logout user"),
  });

  return (
    <Box
      flex={1}
      p={2}
      minWidth="200px"
      width="200px"
      maxWidth="200px"
      position="fixed"
    >
      <List>
        {buttons.map(({ label, hide, ...buttonProps }) =>
          hide ? null : (
            <SideBarButton
              {...buttonProps}
              key={label}
              label={label}
              currentPath={pathname}
            />
          )
        )}
        <ListItem disablePadding>
          <ListItemButton component="button" onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

const useSidebarButtons = () => {
  const { currentUser } = useContext(UserContext);
  const { flags } = useContext(FeatureFlagsContext);

  return [
    {
      path: "/home",
      label: "Feed",
      icon: CampaignIcon,
    },
    {
      path: "/users",
      label: "Following Users",
      icon: PeopleAltIcon,
    },
    {
      path: "/quiz",
      label: "Quiz",
      icon: QuizIcon,
      hide: !flags?.["page.emergency-training"],
    },
    {
      path: "/map",
      label: "Map",
      icon: MapIcon,
      hide: !flags?.["page.airport-challenge"],
    },
    {
      path: "/admin",
      label: "Admin",
      icon: SettingsIcon,
      hide: !currentUser.isAdmin,
    },
  ];
};

export default Sidebar;
