import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Leaves() {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [searchEmployeeName, setSearchEmployeeName] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdminOrHr =
    user?.role === "ADMIN" || user?.role === "HR";

  const fetchAllLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/leaves");

      setLeaves(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to load leave requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrHr) {
      fetchAllLeaves();
    }
  }, [isAdminOrHr]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.post("/api/leaves", {
        employeeName,
        leaveType,
        startDate,
        endDate,
        reason,
      });

      setSuccess("Leave request submitted successfully.");

      setEmployeeName("");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");

      if (isAdminOrHr) {
        fetchAllLeaves();
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to apply for leave.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSearchEmployeeLeaves = async (e) => {
    e.preventDefault();

    if (!searchEmployeeName.trim()) {
      setError("Enter employee name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/api/leaves/employee/${encodeURIComponent(
          searchEmployeeName
        )}`
      );

      setLeaves(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to load employee leave requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setError("");
    setSuccess("");
    setUpdatingId(id);

    try {
      await api.put(
        `/api/leaves/${id}/status?status=${status}`
      );

      setSuccess(
        `Leave request ${status.toLowerCase()} successfully.`
      );

      fetchAllLeaves();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to update leave status.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Leave Management</h1>
          <p>Apply for leave and manage leave requests.</p>
        </div>

        <section className="form-card">
          <h2>Apply for Leave</h2>

          <form
            onSubmit={handleApplyLeave}
            className="leave-form"
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
              <label>Leave Type</label>

              <select
                value={leaveType}
                onChange={(e) =>
                  setLeaveType(e.target.value)
                }
                required
              >
                <option value="">
                  Select leave type
                </option>

                <option value="CASUAL">
                  Casual Leave
                </option>

                <option value="SICK">
                  Sick Leave
                </option>

                <option value="EARNED">
                  Earned Leave
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Reason</label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="Enter reason for leave"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Submitting..."
                  : "Apply for Leave"}
              </button>
            </div>
          </form>
        </section>

        {!isAdminOrHr && (
          <section className="search-card">
            <h2>View My Leave Requests</h2>

            <form
              onSubmit={handleSearchEmployeeLeaves}
              className="search-form"
            >
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
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
              >
                View Leave Requests
              </button>
            </form>
          </section>
        )}

        <section className="table-section">
          <div className="section-heading">
            <h2>
              {isAdminOrHr
                ? "All Leave Requests"
                : "Leave Requests"}
            </h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading leave requests...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {!loading && leaves.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>

                    {isAdminOrHr && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.id}</td>
                      <td>{leave.employeeName}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>

                      <td className="description-cell">
                        {leave.reason}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      {isAdminOrHr && (
                        <td>
                          {leave.status === "PENDING" ? (
                            <div className="action-buttons">
                              <button
                                className="approve-button"
                                onClick={() =>
                                  handleUpdateStatus(
                                    leave.id,
                                    "APPROVED"
                                  )
                                }
                                disabled={
                                  updatingId === leave.id
                                }
                              >
                                {updatingId === leave.id
                                  ? "Updating..."
                                  : "Approve"}
                              </button>

                              <button
                                className="reject-button"
                                onClick={() =>
                                  handleUpdateStatus(
                                    leave.id,
                                    "REJECTED"
                                  )
                                }
                                disabled={
                                  updatingId === leave.id
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="completed-text">
                              Completed
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading &&
            leaves.length === 0 &&
            isAdminOrHr && (
              <div className="empty-message">
                No leave requests found.
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Leaves;