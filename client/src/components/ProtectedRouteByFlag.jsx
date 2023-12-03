import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { FeatureFlagsContext } from "../context/FeatureFlagsContext";

const ProtectedRouteByFlag = ({ flagKey, children }) => {
  const { flags } = useContext(FeatureFlagsContext);

  if (!flags[flagKey]) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRouteByFlag;
