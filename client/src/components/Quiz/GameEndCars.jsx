import { Box, Typography, styled } from "@mui/material";

const RelativeCenteredBox = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  alignContent: "center",
  justifyContent: "center",
});

const GameEndCard = () => {
  return (
    <RelativeCenteredBox>
      <img
        src="door747.gif"
        alt="plane crash"
        style={{ height: "100%", width: "100%" }}
      />
      <Typography
        fontSize={50}
        fontWeight={300}
        sx={{
          padding: 3,
          position: "absolute",
          top: "100%",
          textAlign: "center",
        }}
      >
        Good luck in your safety exame
      </Typography>
    </RelativeCenteredBox>
  );
};

export default GameEndCard;
