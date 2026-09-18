import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">HR Portal</Link>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/leaves">Leave Management</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/payroll">Payroll</Link>
        <Link to="/performance">Performance</Link>
        <Link to="/documents">Employee Documents</Link>
        <Link to="/announcements">Announcements</Link>
      </div>

      <div className="navbar-user">
        <span>{user?.username}</span>
        <span className="navbar-role">{user?.role}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;