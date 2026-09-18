import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [payrollCount, setPayrollCount] = useState(0);
  const [performanceCount, setPerformanceCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdminOrHr =
    user?.role === "ADMIN" || user?.role === "HR";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const announcementResponse =
          await api.get("/api/announcements");

        setAnnouncementCount(announcementResponse.data.length);

        if (isAdminOrHr) {
          const [
            employeeResponse,
            departmentResponse,
            leaveResponse,
            attendanceResponse,
            payrollResponse,
            performanceResponse,
            documentResponse,
          ] = await Promise.all([
            api.get("/api/employees"),
            api.get("/api/departments"),
            api.get("/api/leaves"),
            api.get("/api/attendance"),
            api.get("/api/payroll"),
            api.get("/api/performance"),
            api.get("/api/documents"),
          ]);

          setEmployeeCount(employeeResponse.data.length);
          setDepartmentCount(departmentResponse.data.length);
          setLeaveCount(leaveResponse.data.length);
          setAttendanceCount(attendanceResponse.data.length);
          setPayrollCount(payrollResponse.data.length);
          setPerformanceCount(performanceResponse.data.length);
          setDocumentCount(documentResponse.data.length);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setError("Failed to load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAdminOrHr]);

  return (
    <div>
      <Navbar />

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Employee Management & HR Portal</h1>
            <p>Manage your organization's HR activities in one place.</p>
          </div>

          {user && (
            <div className="welcome-box">
              <strong>Welcome, {user.username}</strong>
              <span>{user.role}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="status-message">
            Loading dashboard...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {isAdminOrHr && (
              <>
                <h2 className="section-title">Portal Overview</h2>

                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>Employees</h3>
                    <strong>{employeeCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Departments</h3>
                    <strong>{departmentCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Leave Requests</h3>
                    <strong>{leaveCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Attendance</h3>
                    <strong>{attendanceCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Payroll</h3>
                    <strong>{payrollCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Performance</h3>
                    <strong>{performanceCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Documents</h3>
                    <strong>{documentCount}</strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>Announcements</h3>
                    <strong>{announcementCount}</strong>
                  </div>
                </div>
              </>
            )}

            {!isAdminOrHr && (
              <div className="employee-dashboard-card">
                <h2>Portal Information</h2>
                <p>
                  You currently have access to employee portal
                  information.
                </p>

                <div className="single-stat">
                  <span>Announcements</span>
                  <strong>{announcementCount}</strong>
                </div>
              </div>
            )}
          </>
        )}

        <div className="modules-section">
          <h2 className="section-title">Portal Modules</h2>

          <div className="module-grid">
            <div className="module-card">
              Employee Management
            </div>

            <div className="module-card">
              Department Management
            </div>

            <div className="module-card">
              Leave Management
            </div>

            <div className="module-card">
              Attendance
            </div>

            <div className="module-card">
              Payroll
            </div>

            <div className="module-card">
              Performance
            </div>

            <div className="module-card">
              Employee Documents
            </div>

            <div className="module-card">
              Announcements
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;