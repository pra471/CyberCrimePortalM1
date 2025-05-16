import React, { useState } from "react";
import "./StatusCheck.css";

export default function StatusCheck() {
  const [ticketId, setTicketId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = () => {
    fetch(`http://localhost:5000/api/status/${ticketId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ticket not found");
        return res.json();
      })
      .then((data) => {
        setResult(data.report);
        setError("");
      })
      .catch(() => {
        setResult(null);
        setError("No report found with this Ticket ID.");
      });
  };

  return (
    <div className="status-container">
      <h2>Check Report Status</h2>
      <input
        type="text"
        placeholder="Enter your Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      <button onClick={handleCheck}>Check Status</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="status-result">
          <p><strong>Crime Type:</strong> {result.crimeType}</p>
          <p><strong>Status:</strong> {result.status || "Pending"}</p>
          <p><strong>Submitted On:</strong> {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
