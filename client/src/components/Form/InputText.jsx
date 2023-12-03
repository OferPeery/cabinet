import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React from "react";

const errorStyle = { padding: 0.5, height: 35 };

const InputText = ({ name, label, error, ...rest }) => {
  return (
    <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput {...rest} name={name} id={name} label={label} />
      {error ? (
        <Alert sx={errorStyle} severity="error">
          {error}
        </Alert>
      ) : (
        <Box sx={errorStyle}></Box>
      )}
    </FormControl>
  );
};

export default InputText;
