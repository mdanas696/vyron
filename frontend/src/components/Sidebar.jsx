import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  return (
    <aside className="side-nav">
      <div className="wordmark">
        VY<span>RON</span>
      </div>

      <NavLink to="/dashboard" className={linkClass} end>
        Overview
      </NavLink>
      <NavLink to="/calendar" className={linkClass}>
        Calendar
      </NavLink>
      <span className="nav-item disabled">Tracker</span>
      <span className="nav-item disabled">Insights</span>

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
  );
};

export default Sidebar;
