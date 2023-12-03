import { Alert, AlertTitle, Button } from "@mui/material";
import React from "react";

const ButtonError = ({ error }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  );
};

const ButtonSubmit = ({
  EndIcon,
  label,
  error,
  onSubmit,
  errorProps,
  ErrorComponent = ButtonError,
  ...rest
}) => {
  return (
    <React.Fragment>
      <Button
        type="submit"
        {...rest}
        variant="contained"
        endIcon={<EndIcon />}
        onClick={onSubmit}
        sx={{ marginRight: 2 }}
      >
        {label}
      </Button>
      {error && <ErrorComponent {...errorProps} error={error} />}
    </React.Fragment>
  );
};

export default ButtonSubmit;
