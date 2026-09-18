import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Performance() {
  const { user } = useAuth();

  const [performance, setPerformance] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchReviewDate, setSearchReviewDate] = useState("");

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

    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/performance");

        setPerformance(response.data);
      } catch (error) {
        console.error(
          "Fetch performance error:",
          error
        );

        setError(
          getErrorMessage(
            error,
            "Failed to load performance reviews."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [isAdminOrHr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !employeeName ||
      !rating ||
      !review ||
      !reviewDate
    ) {
      setError(
        "Please fill all performance review fields."
      );
      return;
    }

    if (
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/api/performance",
        {
          employeeName,
          rating: Number(rating),
          review,
          reviewDate,
        }
      );

      setPerformance((previousPerformance) => [
        ...previousPerformance,
        response.data,
      ]);

      setSuccess(
        "Performance review added successfully."
      );

      setEmployeeName("");
      setRating("");
      setReview("");
      setReviewDate("");
    } catch (error) {
      console.error(
        "Add performance error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to add performance review."
        )
      );
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
        `/api/performance/employee/${encodeURIComponent(
          searchEmployeeName
        )}`
      );

      setPerformance(response.data);
    } catch (error) {
      console.error(
        "Employee performance search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search performance by employee."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateSearch = async () => {
    setError("");
    setSuccess("");

    if (!searchReviewDate) {
      setError("Please enter a review date.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/performance/date/${encodeURIComponent(
          searchReviewDate
        )}`
      );

      setPerformance(response.data);
    } catch (error) {
      console.error(
        "Date performance search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search performance by date."
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
        "/api/performance"
      );

      setPerformance(response.data);
    } catch (error) {
      console.error(
        "Fetch all performance error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to load performance reviews."
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
      "Are you sure you want to delete this performance review?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/api/performance/${id}`
      );

      setPerformance((previousPerformance) =>
        previousPerformance.filter(
          (record) => record.id !== id
        )
      );

      setSuccess(
        "Performance review deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete performance error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to delete performance review."
        )
      );
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Performance Management</h1>
          <p>
            Manage employee performance reviews and ratings.
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
            <h2>Add Performance Review</h2>

            <form
              onSubmit={handleSubmit}
              className="performance-form"
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
                <label>Rating</label>

                <select
                  value={rating}
                  onChange={(e) =>
                    setRating(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select rating
                  </option>

                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="form-group">
                <label>Review Date</label>

                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) =>
                    setReviewDate(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Review</label>

                <textarea
                  value={review}
                  onChange={(e) =>
                    setReview(e.target.value)
                  }
                  placeholder="Enter performance review"
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
                    ? "Saving..."
                    : "Add Review"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="search-card">
          <h2>Search Performance</h2>

          <div className="performance-search-grid">
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
                <label>Review Date</label>

                <input
                  type="date"
                  value={searchReviewDate}
                  onChange={(e) =>
                    setSearchReviewDate(
                      e.target.value
                    )
                  }
                />

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
            )}
          </div>
        </section>

        <section className="table-section">
          <div className="section-heading">
            <h2>Performance Reviews</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading performance reviews...
            </div>
          )}

          {!loading && performance.length === 0 && (
            <div className="empty-message">
              No performance reviews found.
            </div>
          )}

          {!loading && performance.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table performance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Review Date</th>

                    {user?.role === "ADMIN" && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {performance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>

                      <td>{record.employeeName}</td>

                      <td>
                        <span className="rating-badge">
                          {record.rating} / 5
                        </span>
                      </td>

                      <td className="review-cell">
                        {record.review}
                      </td>

                      <td>{record.reviewDate}</td>

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

export default Performance;