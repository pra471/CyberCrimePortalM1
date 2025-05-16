import React, { useState } from "react";
import "./ReportForm.css";

const crimeOptions = ["Phishing", "Online Harassment", "Financial Fraud"];

export default function ReportForm() {
  const [crimeType, setCrimeType] = useState("");
  const [details, setDetails] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setEvidence(file);
      setErrors({ ...errors, evidence: null });
    } else {
      setErrors({ ...errors, evidence: "Only PDF or image files allowed." });
    }
  };

  const validate = () => {
    let errs = {};
    if (!crimeType) errs.crimeType = "Please select a crime type.";
    if (!details) errs.details = "Please provide details.";
    if (!evidence) errs.evidence = "Upload at least one file.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    fetch("http://localhost:5000/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crimeType,
        details,
        evidenceName: evidence.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTicketId(data.ticketId);
          setSubmitted(true);
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error submitting report:", err);
        alert("Failed to connect to server.");
      });
  };

  return (
    <div className="report-page">
      <header className="report-header">
        <h1>Cyber Crime Reporting Portal</h1>
      </header>

      <div className="report-container">
        <h2>Report a Cybercrime</h2>

        {submitted ? (
          <div className="success-box">
            <p><strong>Report submitted successfully!</strong></p>
            <p>Your Ticket ID: <code>{ticketId}</code></p>
            <p>Use this ID to check the status.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Crime Type</label>
              <select value={crimeType} onChange={(e) => setCrimeType(e.target.value)}>
                <option value="">-- Select --</option>
                {crimeOptions.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              {errors.crimeType && <p className="error">{errors.crimeType}</p>}
            </div>

            <div className="form-group">
              <label>Details</label>
              <textarea
                rows="4"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              ></textarea>
              {errors.details && <p className="error">{errors.details}</p>}
            </div>

            <div className="form-group">
              <label>Upload Evidence (PDF/Image)</label>
              <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
              {evidence && <p>Selected: {evidence.name}</p>}
              {errors.evidence && <p className="error">{errors.evidence}</p>}
            </div>

            <button type="submit">Submit Report</button>
          </form>
        )}
      </div>
    </div>
  );
}
