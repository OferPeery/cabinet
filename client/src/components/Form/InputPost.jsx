import { Alert, Box, FormControl, TextField } from "@mui/material";
import React from "react";

const errorStyle = { padding: 0.5, height: 35 };

const InputPost = ({ error, ...rest }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField
        {...rest}
        sx={{ width: "100%" }}
        multiline
        rows={4}
        placeholder="What's on your mind?"
        variant="standard"
      />
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

export default InputPost;
