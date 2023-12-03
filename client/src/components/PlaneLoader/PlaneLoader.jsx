import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import "./animation.css";
import { Box, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";

const BackgroundImage = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  backgroundImage: "url(sky-cartoon1.jpg)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  backgroundAttachment: "fixed",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
});

export const PlaneLoader = () => {
  return (
    <BackgroundImage>
      <Stack direction="column">
        <div className="plane-loader">
          {[...Array(20).keys()].map(i => (
            <span key={i} style={{ "--i": `${i + 1}` }} />
          ))}
          <div className="plane">
            <AirplanemodeActiveIcon className="icon" />
          </div>
        </div>
        <Typography mt={7} fontWeight={300} variant="h5" color="white">
          Taking off...
        </Typography>
      </Stack>
    </BackgroundImage>
  );
};
