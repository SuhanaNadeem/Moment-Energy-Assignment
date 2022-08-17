import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CustomerAuthContext } from "../context/customerAuth";
import { SponsorAuthContext } from "../context/sponsorAuth";
import { CreatorAuthContext } from "../context/creatorAuth";
import { customerClient } from "../GraphqlApolloClients";

function CommonAuthRoute({ children }) {
  const { customer } = useContext(CustomerAuthContext);
  const { sponsor } = useContext(SponsorAuthContext);
  const { creator } = useContext(CreatorAuthContext);

  return customer ? (
    <Navigate to="/customerDashboard" />
  ) : sponsor ? (
    <Navigate to="/sponsorDashboard" />
  ) : creator ? (
    <Navigate to="/creatorDashboard" />
  ) : (
    children
  );
}

export default CommonAuthRoute;
