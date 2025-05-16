// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReportForm from "./ReportForm";
import StatusCheck from "./StatusCheck";
import Navbar from "./Navbar";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import InfoSections from "./InfoSections"; // ✅ Import this

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ReportForm />
              <InfoSections /> {/* ✅ Add this below the form */}
            </>
          }
        />
        <Route path="/status" element={<StatusCheck />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
