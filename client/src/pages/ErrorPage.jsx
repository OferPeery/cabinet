import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <img
        src="/plane-crash.png"
        alt="plane crash"
        style={{ height: 200, width: 200 }}
      />
      <Typography fontSize={36}>Mayday! Mayday! We're going down!</Typography>
    </Box>
  );
};

export default ErrorPage;
