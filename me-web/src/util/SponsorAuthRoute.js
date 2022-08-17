import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SponsorAuthContext } from "../context/sponsorAuth";

function SponsorAuthRoute({ children }) {
  const { sponsor } = useContext(SponsorAuthContext);
  return sponsor ? <Navigate to="/sponsorDashboard" /> : children;
}

export default SponsorAuthRoute;
