import { Box, styled } from "@mui/material";

const OutterBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const InnerBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  maxWidth: "50%",
});

const ModalControlsLayout = ({ children }) => {
  return (
    <OutterBox>
      <InnerBox>{children}</InnerBox>
    </OutterBox>
  );
};

export default ModalControlsLayout;
