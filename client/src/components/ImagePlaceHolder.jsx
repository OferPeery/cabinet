import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)({
  maxHeight: 300,
  maxWidth: 300,
  backgroundColor: "transparent",
  borderStyle: "dashed",
  padding: 1,
  borderRadius: 5,
  borderColor: "gray",
  marginTop: 2,
});

const ImagePlaceHolder = ({ src }) => {
  return (
    <center>
      <StyledBox component="img" src={src} />
    </center>
  );
};

export default ImagePlaceHolder;
