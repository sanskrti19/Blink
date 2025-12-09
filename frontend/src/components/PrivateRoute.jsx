 
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

 
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.exp && Date.now() >= payload.exp * 1000) {
      
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      return false;
    }
  } catch (e) {
   
    return false;
  }
  return true;
};

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
