import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import RegisterForm from "../components/RegisterForm";
import { Navigate } from "react-router-dom";
import { getCurrentUserInCookie } from "../services/authService";
import AirlinesIcon from "@mui/icons-material/Airlines";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const CenteredPage = styled(Box)({
  height: "100%",
  display: "flex",
  backgroundImage: "url(airport-animation1.gif)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  backgroundAttachment: "fixed",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
});

const StyledGrid = styled(Grid)({
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
});

const ModeButton = styled(Button)({
  width: "100%",
});

const ModeButtonBox = styled(Box)({
  display: "flex",
  width: "100%",
  marginRight: 1,
  marginLeft: 1,
});

const LoginPage = () => {
  const [isExistingUser, setIsExistingUser] = useState(true);

  if (getCurrentUserInCookie()) {
    return <Navigate to="/home" />;
  }

  return (
    <CenteredPage>
      <StyledGrid container>
        <StyledGrid item xs={6}>
          <Stack direction="column" p={4} gap={1} mt={2} mb={3}>
            <div className="hello" id="hello">
              <div className="hello-text" id="hello-text">
                <div className="animated-text appear1" id="appear1">
                  {"Hello! "}
                </div>
                <div className="animated-text appear2" id="appear2">
                  <span>
                    Welcome to <AirlinesIcon sx={{ fontSize: 34 }} />
                    <strong>CabiNet</strong>
                  </span>
                </div>
                <div className="appear3">Socialize at new heights</div>
              </div>
            </div>
          </Stack>
        </StyledGrid>
        <StyledGrid item xs={4}>
          <Paper
            elevation={6}
            sx={{
              minWidth: "100%",
              borderRadius: 5,
              alignContent: "center",
              justifyContent: "center",
              opacity: 0.95,
            }}
          >
            <Stack
              sx={{
                display: "flex",
                maxWidth: "92%",
                padding: 2,
              }}
              direction="column"
              spacing={3}
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{ width: "100%" }}
                />
              }
            >
              <Box>
                <Typography variant="h3" fontWeight={250} textAlign="center">
                  {isExistingUser ? "Login" : "Register"}
                </Typography>
                <Typography variant="h6" fontWeight={300} textAlign="center">
                  Welcome aboard
                </Typography>
              </Box>
              {isExistingUser ? <LoginForm /> : <RegisterForm />}

              <ModeButtonBox>
                <ModeButton
                  variant="contained"
                  color="secondary"
                  endIcon={
                    isExistingUser ? (
                      <PersonAddAlt1Icon />
                    ) : (
                      <AssignmentIndIcon />
                    )
                  }
                  onClick={() => setIsExistingUser((isExisting) => !isExisting)}
                >
                  {isExistingUser
                    ? "Create a new account"
                    : "Login as an existing account"}
                </ModeButton>
              </ModeButtonBox>
            </Stack>
          </Paper>
        </StyledGrid>
      </StyledGrid>
    </CenteredPage>
  );
};

export default LoginPage;
