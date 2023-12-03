import { Box, Card, Paper, Typography, styled } from "@mui/material";
import React from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  width: 180,
  height: 120,
  borderRadius: 10,
}));

const StyledPaper = styled(Paper)({
  display: "flex",
  width: "50%",
  justifyContent: "center",
  alignContent: "center",
  textAlign: "center",
  justifySelf: "center",
  marginTop: 3,
  fontWeight: 500,
  fontSize: 28,
});

const ScoreBoard = ({ title, label, color }) => {
  return (
    <StyledCard elevation={10} sx={{ backgroundColor: color }}>
      <Typography
        gutterBottom
        variant="h6"
        fontWeight={400}
        component="div"
        textAlign="center"
        color="text.secondary"
        mt={1.5}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <StyledPaper elevation={3}>{label}</StyledPaper>
      </Box>
    </StyledCard>
  );
};

export default ScoreBoard;
