import React, { useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import UserContext from "./UserContext";

const AppThemeContext = React.createContext();

export const AppThemeContextProvider = ({ children }) => {
  const { currentUser, handleUpdateUser } = useContext(UserContext);

  // every time currentUser changes, it will re-compute this memoized value
  const mode = useMemo(
    () => (currentUser?.isDarkMode ? "dark" : "light"),
    [currentUser]
  );

  const theme = createTheme({
    palette: { mode },
  });

  const appThemeMemo = useMemo(
    () => ({
      mode,

      handleToggleMode: () =>
        handleUpdateUser({
          isDarkMode: mode !== "dark",
        }),
    }),
    [mode, handleUpdateUser]
  );

  return (
    <AppThemeContext.Provider value={appThemeMemo}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export default AppThemeContext;
