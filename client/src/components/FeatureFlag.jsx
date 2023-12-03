import React from "react";
import { Paper, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { RocketLaunch } from "@mui/icons-material";

const FeatureFlag = ({ flag, onChange }) => {
  const { key, description, value } = flag;

  return (
    <Paper
      sx={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        width: "fit-content",
        padding: "12px",
        borderRadius: "6px",
      }}
    >
      <RocketLaunch color="disabled" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Typography
          fontWeight={600}
          width={"400px"}
          maxWidth={"400px"}
          letterSpacing={1.2}
        >
          {key}
        </Typography>
        <Typography color={"text.secondary"} fontSize={12}>
          {description}
        </Typography>
      </Box>
      <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
    </Paper>
  );
};

export default FeatureFlag;
