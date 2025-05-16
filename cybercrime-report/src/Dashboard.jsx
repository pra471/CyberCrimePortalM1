import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [reports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      navigate("/admin-login");
    } else {
      setRole(savedRole);
    }

    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data.reports || []))
      .catch((err) => console.error("Failed to load reports:", err));

    fetch("http://localhost:5000/api/resolved-reports")
      .then((res) => res.json())
      .then((data) => setResolvedReports(data.reports || []))
      .catch((err) => console.error("Failed to load resolved reports:", err));
  }, [navigate]);

  const updateStatus = (ticketId, newStatus) => {
    if (newStatus === "Resolved") {
      const confirm = window.confirm(
        "Are you sure you want to mark this report as Resolved? It will be archived and removed from active list."
      );
      if (!confirm) return; // stop if not confirmed
    }
  
    fetch(`http://localhost:5000/api/reports/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports((prev) => prev.filter((r) => r.ticketId !== ticketId));
  
          if (newStatus === "Resolved") {
            setResolvedReports((prev) => [...prev, data.report]);
            toast.success("✅ Report marked as Resolved and moved to archive.");
          } else {
            toast.success("✅ Status updated successfully.");
          }
        }
      })
      .catch((err) => {
        toast.error("❌ Failed to update status.");
        console.error("Failed to update status:", err);
      });
  };
  

  const handleDownload = () => {
    toast.info("⬇ Downloading Excel file...");
  };

  const filteredReports =
    statusFilter === "All"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-center" autoClose={3000} />

      <h2>{role === "admin" ? "Admin Dashboard" : "Investigator Dashboard"}</h2>

      {role === "admin" && (
        <>
          <div className="filter-bar">
            <label>Status Filter: </label>
            <select onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>In Review</option>
              <option>Resolved</option>
            </select>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Crime Type</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.ticketId}>
                  <td>{report.ticketId}</td>
                  <td>{report.crimeType}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.timestamp).toLocaleString()}</td>
                  <td>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        updateStatus(report.ticketId, e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option>In Review</option>
                      <option>Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {role === "investigator" && (
        <div>
          <h3>Assigned Reports (In Review)</h3>
          <div className="card-container">
            {reports
              .filter((r) => r.status === "In Review")
              .map((r) => (
                <div key={r.ticketId} className="card">
                  <p><strong>ID:</strong> {r.ticketId}</p>
                  <p><strong>Crime:</strong> {r.crimeType}</p>
                  <p><strong>Submitted:</strong> {new Date(r.timestamp).toLocaleString()}</p>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.ticketId, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Review</option>
                    <option>Resolved</option>
                  </select>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="resolved-section">
        <h3>✅ Resolved Reports</h3>
        {resolvedReports.length === 0 ? (
          <p>No resolved reports found.</p>
        ) : (
          <table className="report-table resolved-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Crime Type</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {resolvedReports.map((report) => (
                <tr key={report.ticketId}>
                  <td>{report.ticketId}</td>
                  <td>{report.crimeType}</td>
                  <td>{new Date(report.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <a
          href="http://localhost:5000/api/download-resolved"
          className="download-link"
          download
          onClick={handleDownload}
        >
          ⬇ Download Excel of Resolved Reports
        </a>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("role");
          navigate("/admin-login");
        }}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}
