import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Analytics from "./pages/Analytics";
import Challenges from "./pages/Challenges";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <MainLayout />
            </AdminPrivateRoute>
          }
        >
          <Route path="" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
