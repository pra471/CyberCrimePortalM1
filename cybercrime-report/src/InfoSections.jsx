import React from "react";
import "./ReportForm.css"; // or create InfoSection.css if preferred

export default function InfoSection() {
  return (
    <div className="info-section">
      <div className="info-block vision">
        <span className="label">VISION</span>
        <p>To create a safe cyber space for the citizens of India.</p>
      </div>

      <div className="info-block mission">
        <span className="label">MISSION</span>
        <p>
          To create an effective framework and ecosystem for the prevention, detection,
          investigation, and prosecution of Cybercrime in the country.
        </p>
      </div>

      <div className="info-block disclaimer">
        <span className="label">DISCLAIMER</span>
        <p>
          The National Cyber Reporting Portal (NCRP) is managed by the Indian Cyber Crime
          Coordination Centre (I4C) and is a part of the Ministry of Home Affairs.
        </p>
      </div>
    </div>
  );
}
