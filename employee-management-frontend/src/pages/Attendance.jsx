import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Attendance() {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdminOrHr =
    user?.role === "ADMIN" || user?.role === "HR";

  const getErrorMessage = (error, defaultMessage) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (typeof error.response?.data === "string") {
      return error.response.data;
    }

    if (error.message) {
      return error.message;
    }

    return defaultMessage;
  };

  useEffect(() => {
    if (!isAdminOrHr) {
      return;
    }

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/attendance");

        setAttendance(response.data);
      } catch (error) {
        console.error("Fetch attendance error:", error);

        setError(
          getErrorMessage(
            error,
            "Failed to load attendance."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [isAdminOrHr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!employeeName || !date || !status) {
      setError("Please fill all attendance fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/api/attendance",
        {
          employeeName,
          date,
          status,
        }
      );

      setAttendance((previousAttendance) => [
        ...previousAttendance,
        response.data,
      ]);

      setSuccess("Attendance marked successfully.");

      setEmployeeName("");
      setDate("");
      setStatus("PRESENT");
    } catch (error) {
      console.error("Mark attendance error:", error);

      if (error.response?.status === 409) {
        setError(
          error.response.data ||
            "Attendance already marked for this employee on this date."
        );
      } else {
        setError(
          getErrorMessage(
            error,
            "Failed to mark attendance."
          )
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDateSearch = async () => {
    setError("");
    setSuccess("");

    if (!searchDate) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/attendance/date/${searchDate}`
      );

      setAttendance(response.data);
    } catch (error) {
      console.error("Date search error:", error);

      setError(
        getErrorMessage(
          error,
          "Failed to search attendance by date."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSearch = async () => {
    setError("");
    setSuccess("");

    if (!searchEmployeeName) {
      setError("Please enter an employee name.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/attendance/employee/${encodeURIComponent(
          searchEmployeeName
        )}`
      );

      setAttendance(response.data);
    } catch (error) {
      console.error("Employee search error:", error);

      setError(
        getErrorMessage(
          error,
          "Failed to search attendance by employee."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.get(
        "/api/attendance"
      );

      setAttendance(response.data);
    } catch (error) {
      console.error(
        "Fetch all attendance error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to load attendance."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Attendance Management</h1>
          <p>
            Track employee attendance and attendance records.
          </p>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isAdminOrHr && (
          <section className="form-card">
            <h2>Mark Attendance</h2>

            <form
              onSubmit={handleSubmit}
              className="attendance-form"
            >
              <div className="form-group">
                <label>Employee Name</label>

                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) =>
                    setEmployeeName(e.target.value)
                  }
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="PRESENT">
                    PRESENT
                  </option>

                  <option value="ABSENT">
                    ABSENT
                  </option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Mark Attendance"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="search-card">
          <h2>Search Attendance</h2>

          {isAdminOrHr ? (
            <div className="attendance-search-form">
              <div className="form-group">
                <label>Search by Date</label>

                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) =>
                    setSearchDate(e.target.value)
                  }
                />
              </div>

              <div className="search-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleDateSearch}
                >
                  Search by Date
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
            </div>
          ) : (
            <div className="attendance-search-form">
              <div className="form-group">
                <label>Employee Name</label>

                <input
                  type="text"
                  value={searchEmployeeName}
                  onChange={(e) =>
                    setSearchEmployeeName(
                      e.target.value
                    )
                  }
                  placeholder="Enter employee name"
                />
              </div>

              <div className="search-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleEmployeeSearch}
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="table-section">
          <div className="section-heading">
            <h2>Attendance Records</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading attendance...
            </div>
          )}

          {!loading && attendance.length === 0 && (
            <div className="empty-message">
              No attendance records found.
            </div>
          )}

          {!loading && attendance.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>

                      <td>{record.employeeName}</td>

                      <td>{record.date}</td>

                      <td>
                        <span
                          className={`attendance-status attendance-${record.status.toLowerCase()}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Attendance;