import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Announcements() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [announcementDate, setAnnouncementDate] = useState("");

  const [prioritySearch, setPrioritySearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  const isAdminOrHR =
    user?.role === "ADMIN" || user?.role === "HR";

  const loadAnnouncements = async () => {
    try {
      const response = await api.get("/api/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error loading announcements:", error);
      alert("Failed to load announcements");
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/announcements", {
        title,
        message,
        priority,
        announcementDate,
      });

      alert("Announcement created successfully");

      setTitle("");
      setMessage("");
      setPriority("LOW");
      setAnnouncementDate("");

      loadAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);

      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Failed to create announcement");
      }
    }
  };

  const handlePrioritySearch = async () => {
    if (!prioritySearch) {
      loadAnnouncements();
      return;
    }

    try {
      const response = await api.get(
        `/api/announcements/priority/${prioritySearch}`
      );

      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error searching by priority:", error);
      alert("Failed to search announcements");
    }
  };

  const handleDateSearch = async () => {
    if (!dateSearch) {
      loadAnnouncements();
      return;
    }

    try {
      const response = await api.get(
        `/api/announcements/date/${dateSearch}`
      );

      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error searching by date:", error);
      alert("Failed to search announcements");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this announcement?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/announcements/${id}`);

      alert("Announcement deleted successfully");

      loadAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Announcements</h1>
          <p>
            Create, search, and manage organization announcements.
          </p>
        </div>

        {isAdminOrHR && (
          <section className="form-card">
            <h2>Create Announcement</h2>

            <form
              onSubmit={handleCreate}
              className="announcement-form"
            >
              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div className="form-group">
                <label>Announcement Date</label>

                <input
                  type="date"
                  value={announcementDate}
                  onChange={(e) =>
                    setAnnouncementDate(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Message</label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Enter announcement message"
                  rows="5"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Announcement
                </button>
              </div>
            </form>
          </section>
        )}

        {isAdminOrHR && (
          <section className="search-card">
            <h2>Search Announcements</h2>

            <div className="announcement-search-grid">
              <div className="form-group">
                <label>Search by Priority</label>

                <select
                  value={prioritySearch}
                  onChange={(e) =>
                    setPrioritySearch(e.target.value)
                  }
                >
                  <option value="">
                    All Priorities
                  </option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>

                <button
                  type="button"
                  className="primary-button search-button"
                  onClick={handlePrioritySearch}
                >
                  Search by Priority
                </button>
              </div>

              <div className="form-group">
                <label>Search by Date</label>

                <input
                  type="date"
                  value={dateSearch}
                  onChange={(e) =>
                    setDateSearch(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="primary-button search-button"
                  onClick={handleDateSearch}
                >
                  Search by Date
                </button>
              </div>
            </div>

            <div className="announcement-show-all">
              <button
                type="button"
                className="secondary-button"
                onClick={loadAnnouncements}
              >
                Show All
              </button>
            </div>
          </section>
        )}

        <section className="table-section">
          <div className="section-heading">
            <h2>Announcement List</h2>
          </div>

          {announcements.length === 0 ? (
            <div className="empty-message">
              No announcements found.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table announcements-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Priority</th>
                    <th>Announcement Date</th>

                    {user?.role === "ADMIN" && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement.id}>
                      <td>{announcement.id}</td>

                      <td className="announcement-title">
                        {announcement.title}
                      </td>

                      <td className="announcement-message">
                        {announcement.message}
                      </td>

                      <td>
                        <span
                          className={`priority-badge priority-${announcement.priority.toLowerCase()}`}
                        >
                          {announcement.priority}
                        </span>
                      </td>

                      <td>
                        {announcement.announcementDate}
                      </td>

                      {user?.role === "ADMIN" && (
                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                announcement.id
                              )
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

export default Announcements;