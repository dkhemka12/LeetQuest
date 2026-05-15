import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const needsProfileCompletion = !(user?.firstName && user?.lastName);
    const isCompletionPage = location.pathname === "/complete-profile";

    if (needsProfileCompletion && !isCompletionPage) {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};

export default PrivateRoute;
