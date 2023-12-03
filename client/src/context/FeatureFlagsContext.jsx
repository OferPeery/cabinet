import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import UserContext from "./UserContext";
import {
  getFeatureFlagsValues,
  updateFeatureFlag,
} from "../services/featureFlagsService";

export const FeatureFlagsContext = React.createContext({});

export const FeatureFlagsUpdaterContext = React.createContext();

export const FeatureFlagsContextProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext);
  const [loaded, setLoaded] = useState();
  const [flags, setFlags] = useState({});

  useEffect(() => {
    if (!currentUser?._id) {
      setFlags({});
      return;
    }

    getFeatureFlagsValues().then((flags) => {
      setFlags(flags);
      setLoaded(true);
    });
  }, [currentUser?._id]);

  const updateFlag = useCallback(async (id, value) => {
    const flag = await updateFeatureFlag(id, value);
    await getFeatureFlagsValues().then(setFlags);

    return flag;
  }, []);

  const contextState = useMemo(() => ({ flags, loaded }), [flags, loaded]);

  return (
    <FeatureFlagsContext.Provider value={contextState}>
      <FeatureFlagsUpdaterContext.Provider value={updateFlag}>
        {children}
      </FeatureFlagsUpdaterContext.Provider>
    </FeatureFlagsContext.Provider>
  );
};

export const useFlags = () => useContext(FeatureFlagsContext);

export const useFlag = (key) => {
  const flags = useFlags();
  return flags?.[key];
};

export const useFlagUpdater = () => useContext(FeatureFlagsUpdaterContext);
