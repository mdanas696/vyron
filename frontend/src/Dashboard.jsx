import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="wordmark">
          VY<span>RON</span>
        </div>

        <div className="nav-item active">Overview</div>
        <div className="nav-item">Calendar</div>
        <div className="nav-item">Tracker</div>
        <div className="nav-item">Insights</div>

        <div className="nav-footer">
          <div className="nav-user">
            <strong>{user?.name}</strong>
            {user?.email}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <h2>Welcome, {user?.name?.split(" ")[0]}.</h2>
        <p className="greeting-sub">
          Sprint 1 is live: auth is working end to end. Calendar and tracker land in the next sprints.
        </p>

        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h3>Calendar</h3>
            <p>Events, appointments, priority tasks, and reminders — day view.</p>
            <span className="placeholder-tag">Sprint 2</span>
          </div>
          <div className="placeholder-card">
            <h3>Tracker</h3>
            <p>Custom habit rows, month grid, multi-state marking, monthly analysis.</p>
            <span className="placeholder-tag">Sprint 3</span>
          </div>
          <div className="placeholder-card">
            <h3>Insights</h3>
            <p>Consistency stats, streaks, and what you've been getting done.</p>
            <span className="placeholder-tag">Sprint 4</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
