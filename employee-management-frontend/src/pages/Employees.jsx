import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Employees() {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/employees");

      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const clearForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setDesignation("");
    setPhone("");
    setJoiningDate("");
    setSalary("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const employeeData = {
      name,
      email,
      department,
      designation,
      phone,
      joiningDate,
      salary: Number(salary),
    };

    try {
      if (editingId) {
        await api.put(
          `/api/employees/${editingId}`,
          employeeData
        );

        setSuccess("Employee updated successfully.");
      } else {
        await api.post(
          "/api/employees",
          employeeData
        );

        setSuccess("Employee added successfully.");
      }

      clearForm();
      fetchEmployees();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError(
          editingId
            ? "Failed to update employee."
            : "Failed to add employee."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setPhone(employee.phone);
    setJoiningDate(employee.joiningDate);
    setSalary(employee.salary);

    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/api/employees/${id}`);

      setSuccess("Employee deleted successfully.");

      fetchEmployees();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to delete employee.");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Employee Management</h1>
          <p>Manage employee information and records.</p>
        </div>

        {user?.role === "ADMIN" || user?.role === "HR" ? (
          <section className="form-card">
            <h2>
              {editingId
                ? "Update Employee"
                : "Add Employee"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="employee-form"
            >
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter employee email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter department"
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Enter designation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Enter salary"
                  min="0"
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
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Employee"
                    : "Add Employee"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        ) : null}

        <section className="table-section">
          <div className="section-heading">
            <h2>Employee List</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading employees...
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

          {!loading && !error && (
            <>
              {employees.length === 0 ? (
                <div className="empty-message">
                  No employees found.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th>Joining Date</th>
                        <th>Salary</th>

                        {user?.role === "ADMIN" ||
                        user?.role === "HR" ? (
                          <th>Edit</th>
                        ) : null}

                        {user?.role === "ADMIN" ? (
                          <th>Delete</th>
                        ) : null}
                      </tr>
                    </thead>

                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.id}</td>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.department}</td>
                          <td>{employee.designation}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.joiningDate}</td>
                          <td>{employee.salary}</td>

                          {user?.role === "ADMIN" ||
                          user?.role === "HR" ? (
                            <td>
                              <button
                                className="edit-button"
                                onClick={() =>
                                  handleEdit(employee)
                                }
                              >
                                Edit
                              </button>
                            </td>
                          ) : null}

                          {user?.role === "ADMIN" ? (
                            <td>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDelete(employee.id)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Employees;