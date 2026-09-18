import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Departments() {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/departments");

      setDepartments(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to load departments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.post("/api/departments", {
        name,
        description,
      });

      setSuccess("Department added successfully.");

      setName("");
      setDescription("");

      fetchDepartments();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to add department.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(`/api/departments/${id}`);

      setSuccess("Department deleted successfully.");

      fetchDepartments();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to delete department.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Department Management</h1>
          <p>Manage departments and their descriptions.</p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "HR") && (
          <section className="form-card">
            <h2>Add Department</h2>

            <form
              onSubmit={handleAddDepartment}
              className="department-form"
            >
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter department description"
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
                  {saving ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="table-section">
          <div className="section-heading">
            <h2>Department List</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading departments...
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
              {departments.length === 0 ? (
                <div className="empty-message">
                  No departments found.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>

                        {user?.role === "ADMIN" && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {departments.map((department) => (
                        <tr key={department.id}>
                          <td>{department.id}</td>

                          <td>{department.name}</td>

                          <td className="description-cell">
                            {department.description}
                          </td>

                          {user?.role === "ADMIN" && (
                            <td>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDeleteDepartment(
                                    department.id
                                  )
                                }
                                disabled={
                                  deletingId === department.id
                                }
                              >
                                {deletingId === department.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </td>
                          )}
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

export default Departments;