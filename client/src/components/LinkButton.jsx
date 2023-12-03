import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const LinkButton = ({ to, label, ...rest }) => {
  return (
    <Link to={to}>
      <Button {...rest}>{label}</Button>
    </Link>
  );
};

export default LinkButton;
