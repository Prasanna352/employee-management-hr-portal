import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function EmployeeDocuments() {
  const { user } = useAuth();

  const [documents, setDocuments] = useState([]);

  const [employeeName, setEmployeeName] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentPath, setDocumentPath] = useState("");

  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchDocumentType, setSearchDocumentType] = useState("");

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

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/documents");

        setDocuments(response.data);
      } catch (error) {
        console.error(
          "Fetch documents error:",
          error
        );

        setError(
          getErrorMessage(
            error,
            "Failed to load employee documents."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isAdminOrHr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !employeeName ||
      !documentName ||
      !documentType
    ) {
      setError(
        "Please fill all required document fields."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/api/documents",
        {
          employeeName,
          documentName,
          documentType,
          documentPath,
        }
      );

      setDocuments((previousDocuments) => [
        ...previousDocuments,
        response.data,
      ]);

      setSuccess(
        "Employee document added successfully."
      );

      setEmployeeName("");
      setDocumentName("");
      setDocumentType("");
      setDocumentPath("");
    } catch (error) {
      console.error(
        "Add document error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to add employee document."
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
        `/api/documents/employee/${encodeURIComponent(
          searchEmployeeName
        )}`
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(
        "Employee document search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search documents by employee."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSearch = async () => {
    setError("");
    setSuccess("");

    if (!searchDocumentType) {
      setError("Please enter a document type.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/documents/type/${encodeURIComponent(
          searchDocumentType
        )}`
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(
        "Document type search error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to search documents by type."
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
        "/api/documents"
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(
        "Fetch all documents error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to load employee documents."
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
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/api/documents/${id}`
      );

      setDocuments((previousDocuments) =>
        previousDocuments.filter(
          (document) => document.id !== id
        )
      );

      setSuccess(
        "Employee document deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Failed to delete employee document."
        )
      );
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Employee Documents</h1>
          <p>
            Manage employee documents and document records.
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
            <h2>Add Employee Document</h2>

            <form
              onSubmit={handleSubmit}
              className="documents-form"
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
                <label>Document Name</label>

                <input
                  type="text"
                  value={documentName}
                  onChange={(e) =>
                    setDocumentName(e.target.value)
                  }
                  placeholder="Example: Aadhaar Card"
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Type</label>

                <input
                  type="text"
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(e.target.value)
                  }
                  placeholder="Example: Identity"
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Path</label>

                <input
                  type="text"
                  value={documentPath}
                  onChange={(e) =>
                    setDocumentPath(e.target.value)
                  }
                  placeholder="Enter document path"
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
                    : "Add Document"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="search-card">
          <h2>Search Documents</h2>

          <div className="documents-search-grid">
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
                <label>Document Type</label>

                <input
                  type="text"
                  value={searchDocumentType}
                  onChange={(e) =>
                    setSearchDocumentType(
                      e.target.value
                    )
                  }
                  placeholder="Example: Identity"
                />

                <div className="search-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleTypeSearch}
                  >
                    Search by Type
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
            <h2>Employee Documents</h2>
          </div>

          {loading && (
            <div className="status-message">
              Loading documents...
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="empty-message">
              No employee documents found.
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table documents-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Document Name</th>
                    <th>Document Type</th>
                    <th>Document Path</th>

                    {user?.role === "ADMIN" && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id}>
                      <td>{document.id}</td>
                      <td>{document.employeeName}</td>
                      <td>{document.documentName}</td>
                      <td>
                        <span className="document-type-badge">
                          {document.documentType}
                        </span>
                      </td>
                      <td className="document-path-cell">
                        {document.documentPath || "-"}
                      </td>

                      {user?.role === "ADMIN" && (
                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(document.id)
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

export default EmployeeDocuments;