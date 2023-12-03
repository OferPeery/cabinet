import React, { useState } from "react";
import InputText from "./InputText.jsx";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputPassword = ({ ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputText
      {...rest}
      type={showPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword((show) => !show)}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default InputPassword;
