import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CustomerAuthContext } from "../context/customerAuth";

function CustomerAuthRoute({ children }) {
  const { customer } = useContext(CustomerAuthContext);
  return customer ? <Navigate to="/customerDashboard" /> : children;
}

export default CustomerAuthRoute;
