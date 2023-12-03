import React, { useContext, useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import Joi from "joi";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import AddCommentIcon from "@mui/icons-material/AddComment";
import {
  Avatar,
  LinearProgress,
  Stack,
  Typography,
  styled,
  Button,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import UserContext from "../context/UserContext";
import useForm from "./Form/useForm.jsx";
import InputPost from "./Form/InputPost";
import { useRequest } from "ahooks";
import { addNewPost } from "../services/postsService";
import { getServerImageUrl, uploadImage } from "../services/imagesService";
import { FeatureFlagsContext } from "../context/FeatureFlagsContext";
import { showHttpErrorToast } from "../utils/toast";
import { imageFileFormats } from "../services/imagesService";
import AppModal from "./Modal/AppModal";
import ImagePlaceHolder from "./ImagePlaceHolder";
import ModalTitle from "./Modal/ModalTitle";

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

const initialData = {
  text: "",
};

const maxCharacters = 300;
const schema = Joi.object({
  text: Joi.string().max(maxCharacters).label("Post content").required(),
});

const CreatePostModal = ({ onPostAdded, uploadImageToggle = true }) => {
  const { currentUser } = useContext(UserContext);
  const { flags } = useContext(FeatureFlagsContext);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleAddNewPost = async (post) => {
    setShowProgress(true);
    post.imageUrl = "";
    // Admin Toggle
    if (file && uploadImageToggle) {
      post.imageUrl = await uploadImage(file);
    }
    const addedPost = await addNewPost(post);
    return addedPost;
  };

  const handleImageChosen = (e) => {
    const fileToUpload = e.target.files[0];
    setFile(fileToUpload);
    setFileUrl(URL.createObjectURL(fileToUpload));
  };

  const {
    data: addedPost,
    run,
    error,
    loading,
  } = useRequest(handleAddNewPost, {
    manual: true,
    onError: (e) => showHttpErrorToast(e, "Failed to create post"),
  });

  const { resetInputs, renderInput, renderButtonSumbit } = useForm(
    initialData,
    schema,
    run
  );

  useEffect(() => {
    const timer = showProgress
      ? setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              if (!loading) {
                setShowProgress(false);
                setOpen(false);
                resetInputs();
                setFile(undefined);
                setFileUrl(undefined);
                if (!error) {
                  onPostAdded(addedPost);
                }
              }
              return 0;
            }
            const diff = Math.random() * 15;
            return Math.min(oldProgress + diff, 100);
          });
        }, 100)
      : 0;

    return () => {
      clearInterval(timer);
    };
  }, [showProgress, addedPost, onPostAdded, loading, resetInputs, error]);

  return (
    <React.Fragment>
      <Tooltip
        onClick={() => setOpen(true)}
        title="New Post"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>

      <AppModal open={open} onClose={(e) => setOpen(false)}>
        <ModalTitle title="Create Post" />
        <UserBox>
          <Avatar
            src={getServerImageUrl(currentUser.profileUrl)}
            sx={{ width: 45, height: 45 }}
          />
          <Stack direction="column">
            <Typography fontWeight={500} variant="span">
              {`${currentUser.firstName} ${currentUser.lastName}`}
            </Typography>
            <Typography fontWeight={300} variant="span">
              {`@${currentUser.username}`}
            </Typography>
          </Stack>
        </UserBox>

        {renderInput(InputPost, "text", "New Post:")}
        {fileUrl && <ImagePlaceHolder src={fileUrl} />}
        <Stack direction="row" gap={1} mt={2} mb={3} justifyContent="center">
          {flags?.["feature.post-upload-image"] && (
            <Button
              variant="outlined"
              color="secondary"
              component="label"
              startIcon={<Image />}
            >
              Choose an image
              <input
                hidden
                type="file"
                accept={imageFileFormats}
                onChange={handleImageChosen}
              />
            </Button>
          )}
          {renderButtonSumbit(AddCommentIcon, "Post", error?.response?.data)}
        </Stack>

        {showProgress && (
          <Box sx={{ marginTop: "10px" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
      </AppModal>
    </React.Fragment>
  );
};

export default CreatePostModal;
