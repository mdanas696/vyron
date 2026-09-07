import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
