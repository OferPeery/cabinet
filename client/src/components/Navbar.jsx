import React, { useContext, useRef, useState } from "react";
import { useRequest } from "ahooks";
import {
  AppBar,
  Toolbar,
  styled,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
  ListItemButton,
  Select,
  InputLabel,
  Popover,
} from "@mui/material";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import AirlinesIcon from "@mui/icons-material/Airlines";
import UserContext from "../context/UserContext";
import DarkmodeSwitch from "./DarkmodeSwitch";
import AppThemeContext from "../context/AppThemeContext";
import { FeatureFlagsContext } from "../context/FeatureFlagsContext";
import { getServerImageUrl, uploadImage } from "../services/imagesService";
import { showHttpErrorToast } from "../utils/toast";
import { Image } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import FlightIcon from "@mui/icons-material/Flight";
import { airlines, positions } from "../utils/airlines";
import AppModal from "./Modal/AppModal";
import AirlineLogo from "./AirlineLogo";
import { imageFileFormats } from "../services/imagesService";
import ImagePlaceHolder from "./ImagePlaceHolder";
import ModalTitle from "./Modal/ModalTitle";
import ModalControlsLayout from "./Modal/ModalControlsLayout";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

const Navbar = () => {
  const { currentUser, handleUpdateUser } = useContext(UserContext);
  const { flags } = useContext(FeatureFlagsContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  //const [open, setOpen] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [isSwtichDisabled, setIsSwitchDisabled] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openBioModal, setOpenBioModal] = useState(false);
  const [file, setFile] = useState();
  const [nextProfileUrl, setNextProfileUrl] = useState();
  const { handleToggleMode } = useContext(AppThemeContext);
  const [airline, setAirline] = useState(currentUser.airline);
  const [position, setPosition] = useState(currentUser.position);
  const { run: toggleDarkMode } = useRequest(handleToggleMode, {
    manual: true,
    onBefore: () => setIsSwitchDisabled(true),
    onError: (e) => showHttpErrorToast(e, "Failed to toggle dark mode"),
    onFinally: () => setIsSwitchDisabled(false),
  });

  const handleUploadImage = async () => {
    const profileUrl = await uploadImage(file);
    await handleUpdateUser({ profileUrl });
    return profileUrl;
  };

  const handleImageChosen = (e) => {
    const fileToUpload = e.target.files[0];
    setFile(fileToUpload);
    setNextProfileUrl(URL.createObjectURL(fileToUpload));
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
    setNextProfileUrl(undefined);
    setFile(undefined);
  };

  const handleCloseBioModal = () => {
    setOpenBioModal(false);
    setAirline(currentUser.airline);
    setPosition(currentUser.position);
  };

  const { run: runUploadImage } = useRequest(handleUploadImage, {
    manual: true,
    onError: (e) => showHttpErrorToast(e, "Failed to upload profile picture"),
    onSuccess: () => toast.success("Profile picture was changed!"),
    onFinally: () => handleCloseProfileModal(),
  });

  const { run: runUpdateBio } = useRequest(
    () => handleUpdateUser({ airline, position }),
    {
      manual: true,
      onError: (e) => showHttpErrorToast(e, "Failed to update airline bio"),
      onSuccess: () => toast.success("Airline bio was changed!"),
      onFinally: () => setOpenBioModal(false),
    }
  );

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Stack direction="row" spacing={1}>
          <AirlinesIcon sx={{ fontSize: 30 }} />
          <Typography variant="h5" sx={{ display: "inline-block" }}>
            CabiNet
          </Typography>
        </Stack>
        <Icons>
          {flags?.["feature.dark-mode"] && (
            <DarkmodeSwitch
              disabled={isSwtichDisabled}
              checked={currentUser?.isDarkMode}
              onChange={toggleDarkMode}
            />
          )}
          <Stack direction="column">
            <Typography textAlign="right">{`${currentUser.firstName} ${currentUser.lastName}`}</Typography>
            <Typography
              textAlign="right"
              fontWeight={300}
              sx={{ fontSize: 13 }}
            >
              @{currentUser.username}
            </Typography>
          </Stack>
          <Tooltip
            aria-describedby={id}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            title="Upload user info"
            sx={{
              position: "fixed",
              bottom: 20,
              left: { xs: "calc(50% - 25px)", md: 30 },
            }}
          >
            <Avatar
              sx={{
                width: 45,
                height: 45,
                "&:hover": { cursor: "pointer", width: 47, height: 47 },
              }}
              src={getServerImageUrl(currentUser.profileUrl)}
            />
          </Tooltip>
        </Icons>
      </StyledToolbar>

      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem>
          <ListItemButton
            onClick={() => {
              setOpenProfileModal(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <SwitchAccountIcon />
            </ListItemIcon>
            <ListItemText primary="Profile Picture" />
          </ListItemButton>
        </MenuItem>
        <MenuItem>
          <ListItemButton
            onClick={async () => {
              setOpenBioModal(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="Airline Bio" />
          </ListItemButton>
        </MenuItem>
      </Menu>

      <AppModal open={openProfileModal} onClose={handleCloseProfileModal}>
        <ModalTitle title="Choose your profile picture" />
        <ImagePlaceHolder
          src={
            nextProfileUrl ||
            (currentUser.profileUrl !== ""
              ? getServerImageUrl(currentUser.profileUrl)
              : "/flight-attendant-icon.png")
          }
        />

        <ModalControlsLayout>
          <Button
            sx={{ marginTop: 1 }}
            variant="outlined"
            color="secondary"
            component="label"
            startIcon={<Image />}
          >
            Choose an image
            <input
              hidden
              type="file"
              accept={imageFileFormats}
              onChange={handleImageChosen}
            />
          </Button>
          <Button
            sx={{ marginTop: 1 }}
            variant="contained"
            color="info"
            endIcon={<CloudUploadIcon />}
            onClick={runUploadImage}
            disabled={!nextProfileUrl}
          >
            Upload
          </Button>
        </ModalControlsLayout>
      </AppModal>

      <AppModal open={openBioModal} onClose={handleCloseBioModal}>
        <ModalTitle title="Update Bio" />
        <ModalControlsLayout>
          {
            <>
              <InputLabel htmlFor="airline" sx={{ marginTop: 4 }}>
                Choose Airline
              </InputLabel>
              <Select
                id="airline"
                onChange={(e) => setAirline(e.target.value)}
                value={airline === "" ? undefined : airline}
              >
                {airlines.map((airline) => (
                  <MenuItem key={airline.name} value={airline.name}>
                    <AirlineLogo src={airline?.logoUrl} />
                    {airline.name}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel htmlFor="position" sx={{ marginTop: 4 }}>
                Choose Position
              </InputLabel>
              <Select
                id="position"
                onChange={(e) => setPosition(e.target.value)}
                value={position === "" ? undefined : position}
              >
                {positions.map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </Select>
              <Button disabled={!airline || !position} onClick={runUpdateBio}>
                Update
              </Button>
            </>
          }
        </ModalControlsLayout>
      </AppModal>
    </AppBar>
  );
};

export default Navbar;
