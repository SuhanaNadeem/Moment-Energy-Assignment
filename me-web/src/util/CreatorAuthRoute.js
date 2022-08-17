import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CreatorAuthContext } from "../context/creatorAuth";

function CreatorAuthRoute({ children }) {
  const { creator } = useContext(CreatorAuthContext);
  return creator ? <Navigate to="/creatorDashboard" /> : children;
}

export default CreatorAuthRoute;
