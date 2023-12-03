import React from "react";
import { Box, Modal, styled } from "@mui/material";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AppModal = ({ children, maxHeight = 800, minHeight = 400, ...rest }) => {
  return (
    <StyledModal {...rest}>
      <Box
        className="overflow-content"
        width={600}
        maxHeight={maxHeight}
        minHeight={minHeight}
        bgcolor={"background.default"}
        color={"text.primary"}
        p={3}
        borderRadius={5}
        sx={{ overflow: "scroll" }}
      >
        {children}
      </Box>
    </StyledModal>
  );
};

export default AppModal;
