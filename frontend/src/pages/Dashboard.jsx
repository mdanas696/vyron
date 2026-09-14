import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <h2>Welcome, {user?.name?.split(" ")[0]}.</h2>
        <p className="greeting-sub">
          Sprint 2 is live: your calendar is real now. Tracker and insights land next.
        </p>

        <div className="placeholder-grid">
          <Link to="/calendar" className="placeholder-card active-card">
            <div className="placeholder-card-header">
              <h3>Calendar</h3>
              <span className="placeholder-lock">→</span>
            </div>
            <p>Events, appointments, priority tasks, and reminders — day view.</p>
            <span className="placeholder-tag active-tag">Open calendar</span>
          </Link>
          <div className="placeholder-card">
            <div className="placeholder-card-header">
              <h3>Tracker</h3>
              <span className="placeholder-lock">🔒</span>
            </div>
            <p>Custom habit rows, month grid, multi-state marking, monthly analysis.</p>
            <span className="placeholder-tag">Not built yet</span>
          </div>
          <div className="placeholder-card">
            <div className="placeholder-card-header">
              <h3>Insights</h3>
              <span className="placeholder-lock">🔒</span>
            </div>
            <p>Consistency stats, streaks, and what you've been getting done.</p>
            <span className="placeholder-tag">Not built yet</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
