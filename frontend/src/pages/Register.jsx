import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password, accountType);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-wordmark">
          VY<span>RON</span>
        </h1>
        <p className="auth-subtitle">Set up your account to start tracking.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="field-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="field-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="field-label">I'm a</label>
            <div className="account-type-row">
              <button
                type="button"
                className={`account-type-option ${accountType === "student" ? "active" : ""}`}
                onClick={() => setAccountType("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`account-type-option ${accountType === "working" ? "active" : ""}`}
                onClick={() => setAccountType("working")}
              >
                Working professional
              </button>
            </div>
          </div>
          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
