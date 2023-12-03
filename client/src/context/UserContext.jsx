import React, { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { loginToApp, logoutApp, registerToApp } from "../services/authService";
import { fetchCurrentUser, updateUser } from "../services/usersService";

const UserContext = React.createContext();
UserContext.displayName = "UserContext";

export const UserContextProvider = ({ children }) => {
  const {
    data: currentUser,
    mutate,
    runAsync,
  } = useRequest(fetchCurrentUser, {
    manual: true,
  });
  const navigate = useNavigate();

  const userMemo = useMemo(
    () => ({
      currentUser,

      // userInfo: { username, password, isRememberMe }
      handleLogin: async (userInfo) => {
        await loginToApp(userInfo);
        navigate("/");
      },

      handleLogout: async () => {
        await logoutApp();
        mutate(undefined);
        navigate("/login");
      },

      handleRegister: async (userInfo) => {
        await registerToApp(userInfo);
        navigate("/");
      },

      handleUpdateUser: async (userPropertiesToUpdate) => {
        const updatedUser = await updateUser(
          currentUser._id,
          userPropertiesToUpdate
        );

        mutate(updatedUser);
      },

      isUserLoggedIn: () => !!currentUser,

      refetchUser: runAsync,
    }),
    [currentUser, navigate, mutate, runAsync]
  );

  return (
    <UserContext.Provider value={userMemo}>{children}</UserContext.Provider>
  );
};

export const useLoginUser = () => {
  const { currentUser, handleLogin } = useContext(UserContext);
  const { loading, run, error } = useRequest(handleLogin, {
    manual: true,
  });

  return {
    currentUser,
    onLogin: run,
    loading,
    errorLogin: error?.response?.data?.message,
  };
};

export const useRegisterUser = () => {
  const { currentUser, handleRegister } = useContext(UserContext);
  const { loading, run, error } = useRequest(handleRegister, { manual: true });

  return {
    currentUser,
    handleRegister: run,
    loading,
    errorRegister: error?.response?.data?.message,
  };
};

export default UserContext;
