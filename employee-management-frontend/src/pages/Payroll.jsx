import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Payroll() {
  const { user } = useAuth();

  const [payroll, setPayroll] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [payMonth, setPayMonth] = useState("");

  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchPayMonth, setSearchPayMonth] = useState("");

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

    const fetchPayroll = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/payroll");

        setPayroll(response.data);
      } catch (error) {
        console.error("Fetch payroll error:", error);

        setError(
          getErrorMessage(
            error,
            "Failed to load payroll."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, [isAdminOrHr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !employeeName ||
      !basicSalary ||
      !allowances ||
      !deductions ||
      !payMonth
    ) {
      setError("Please fill all payroll fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/api/payroll",
        {
          employeeName,
          basicSalary: Number(basicSalary),
          allowances: Number(allowances),
          deductions: Number(deductions),
          netSalary: 0,
          payMonth,
        }
      );

      setPayroll((previousPayroll) => [
        ...previousPayroll,
        response.data,
      ]);

      setSuccess("Payroll added successfully.");

      setEmployeeName("");
      setBasicSalary("");
      setAllowances("");
      setDeductions("");
      setPayMonth("");
    } catch (error) {
      console.error("Add payroll error:", error);

      if (error.response?.status === 409) {
        setError(
          error.response.data ||
            "Payroll already exists for this employee for this month."
        );
      } else {
        setError(
          getErrorMessage(
            error,
            "Failed to add payroll."
          )
        );
      }
    } finally {
      setSaving(false);
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
        `/api/payroll/employee/${encodeURIComponent(
          searchEmployeeName
        )}`
      );

      setPayroll(response.data);
    } catch (error) {
      console.error(
        "Employee payroll search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search payroll by employee."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMonthSearch = async () => {
    setError("");
    setSuccess("");

    if (!searchPayMonth) {
      setError("Please enter a pay month.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/payroll/month/${encodeURIComponent(
          searchPayMonth
        )}`
      );

      setPayroll(response.data);
    } catch (error) {
      console.error(
        "Month payroll search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search payroll by month."
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

      const response = await api.get("/api/payroll");

      setPayroll(response.data);
    } catch (error) {
      console.error(
        "Fetch all payroll error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to load payroll."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payroll record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/payroll/${id}`);

      setPayroll((previousPayroll) =>
        previousPayroll.filter(
          (record) => record.id !== id
        )
      );

      setSuccess("Payroll deleted successfully.");
    } catch (error) {
      console.error(
        "Delete payroll error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to delete payroll."
        )
      );
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Payroll Management</h1>
          <p>
            Manage employee salaries and payroll records.
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
            <h2>Add Payroll</h2>

            <form
              onSubmit={handleSubmit}
              className="payroll-form"
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
                <label>Basic Salary</label>

                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) =>
                    setBasicSalary(e.target.value)
                  }
                  placeholder="Enter basic salary"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Allowances</label>

                <input
                  type="number"
                  value={allowances}
                  onChange={(e) =>
                    setAllowances(e.target.value)
                  }
                  placeholder="Enter allowances"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deductions</label>

                <input
                  type="number"
                  value={deductions}
                  onChange={(e) =>
                    setDeductions(e.target.value)
                  }
                  placeholder="Enter deductions"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pay Month</label>

                <input
                  type="text"
                  value={payMonth}
                  onChange={(e) =>
                    setPayMonth(e.target.value)
                  }
                  placeholder="Example: September-2026"
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
                    ? "Saving..."
                    : "Add Payroll"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="search-card">
          <h2>Search Payroll</h2>

          <div className="payroll-search-grid">
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

              <button
                type="button"
                className="primary-button search-button"
                onClick={handleEmployeeSearch}
              >
                Search by Employee
              </button>
            </div>

            {isAdminOrHr && (
              <div className="form-group">
                <label>Pay Month</label>

                <input
                  type="text"
                  value={searchPayMonth}
                  onChange={(e) =>
                    setSearchPayMonth(
                      e.target.value
                    )
                  }
                  placeholder="Example: September-2026"
                />

                <div className="search-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleMonthSearch}
                  >
                    Search by Month
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
            )}
          </div>
        </section>

        <section className="table-section">
          <div className="section-heading">
            <h2>Payroll Records</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading payroll...
            </div>
          )}

          {!loading && payroll.length === 0 && (
            <div className="empty-message">
              No payroll records found.
            </div>
          )}

          {!loading && payroll.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table payroll-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Pay Month</th>

                    {user?.role === "ADMIN" && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {payroll.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.employeeName}</td>
                      <td>{record.basicSalary}</td>
                      <td>{record.allowances}</td>
                      <td>{record.deductions}</td>

                      <td className="net-salary">
                        {record.netSalary}
                      </td>

                      <td>{record.payMonth}</td>

                      {user?.role === "ADMIN" && (
                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(record.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      )}
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

export default Payroll;