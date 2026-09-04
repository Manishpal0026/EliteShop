import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const userInfo =
    localStorage.getItem("userInfo");


  // ==========================================
  // NO LOGIN
  // ==========================================

  if (!userInfo) {

    console.log(
      "AdminRoute: No user logged in"
    );

    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }


  let user;


  // ==========================================
  // READ USER DATA
  // ==========================================

  try {

    user = JSON.parse(userInfo);

  }

  catch (error) {

    console.error(
      "AdminRoute: Invalid userInfo"
    );

    localStorage.removeItem(
      "userInfo"
    );

    localStorage.removeItem(
      "adminInfo"
    );

    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }


  // ==========================================
  // GET ROLE
  // ==========================================

  const role =
    user?.role ||
    user?.user?.role;


  console.log(
    "AdminRoute user:",
    user
  );

  console.log(
    "AdminRoute role:",
    role
  );


  // ==========================================
  // NOT ADMIN
  // ==========================================

  if (role !== "admin") {

    console.log(
      "AdminRoute: Access denied"
    );

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // ==========================================
  // ADMIN
  // ==========================================

  console.log(
    "AdminRoute: Admin access granted"
  );


  return children;
};


export default AdminRoute;

