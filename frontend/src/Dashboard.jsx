import React from "react";
import { useAuth } from "./AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>VYRON</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.accountType}
          </p>
        </div>
      </main>
    </div>
  );
}
