import { FormControl, FormControlLabel, Typography } from "@mui/material";
import React from "react";

const InputControl = ({ ControlComponent, label, error, ...rest }) => {
  return (
    <FormControl>
      <FormControlLabel
        sx={{ m: 1 }}
        control={<ControlComponent {...rest} />}
        label={label}
      />
      {error && <Typography color="red">{error}</Typography>}
    </FormControl>
  );
};

export default InputControl;
