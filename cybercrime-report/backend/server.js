// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const XLSX = require("xlsx"); // for Excel export
// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // File where reports are stored
// const REPORTS_FILE = "./reports.json";

// // Ensure file exists
// if (!fs.existsSync(REPORTS_FILE)) {
//   fs.writeFileSync(REPORTS_FILE, "[]");
// }

// // Submit report
// app.post("/api/report", (req, res) => {
//   const report = req.body;
//   report.timestamp = new Date().toISOString();

//   // Generate unique ticket ID
//   const id = "CYB" + Math.floor(100000 + Math.random() * 900000);
//   report.ticketId = id;

//   const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
//   reports.push(report);
//   fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

//   res.json({ success: true, ticketId: id });
// });

// // Get all reports
// app.get("/api/reports", (req, res) => {
//   const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
//   res.json({ reports });
// });

// // Check report status
// app.get("/api/status/:ticketId", (req, res) => {
//   const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
//   const found = reports.find(r => r.ticketId === req.params.ticketId);
//   if (found) {
//     res.json({ success: true, report: found });
//   } else {
//     res.status(404).json({ success: false, message: "Ticket not found" });
//   }
// });

// // ✅ Enhanced PATCH route for status update + Excel archive
// app.patch("/api/reports/:ticketId", (req, res) => {
//   const { ticketId } = req.params;
//   const { status } = req.body;

//   let reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
//   const index = reports.findIndex(r => r.ticketId === ticketId);

//   if (index === -1) {
//     return res.status(404).json({ success: false, message: "Report not found" });
//   }

//   const report = reports[index];
//   report.status = status;

//   if (status === "Resolved") {
//     // Remove from JSON
//     reports.splice(index, 1);
//     fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

//     // Append to Excel
//     const resolvedPath = "./resolved_reports.xlsx";
//     let wb, ws, data = [];

//     if (fs.existsSync(resolvedPath)) {
//       const file = XLSX.readFile(resolvedPath);
//       ws = file.Sheets[file.SheetNames[0]];
//       data = XLSX.utils.sheet_to_json(ws);
//       wb = file;
//     } else {
//       wb = XLSX.utils.book_new();
//     }

//     data.push(report);
//     const newWS = XLSX.utils.json_to_sheet(data);
//     XLSX.utils.book_append_sheet(wb, newWS, "ResolvedReports", true);
//     XLSX.writeFile(wb, resolvedPath);
//   } else {
//     // Just update status
//     reports[index] = report;
//     fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
//   }

//   res.json({ success: true, report });
// });
// // ✅ Fetch resolved reports
// app.get("/api/resolved-reports", (req, res) => {
//   const resolvedPath = "./resolved_reports.xlsx";
//   if (!fs.existsSync(resolvedPath)) {
//     return res.json({ reports: [] });
//   }

//   const workbook = XLSX.readFile(resolvedPath);
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = XLSX.utils.sheet_to_json(sheet);
//   res.json({ reports: data });
// });

// // ✅ Optional: Allow downloading the Excel file
// app.get("/api/download-resolved", (req, res) => {
//   const resolvedPath = "./resolved_reports.xlsx";
//   if (!fs.existsSync(resolvedPath)) {
//     return res.status(404).send("No resolved reports available.");
//   }
//   res.download(resolvedPath);
// });

// // ✅ Home route
// app.get("/", (req, res) => {
//   res.send("🚀 Cybercrime Reporting API is running.");
// });

// // ✅ Start server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx"); // for Excel export
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// File where reports are stored
const REPORTS_FILE = "./reports.json";

// Ensure file exists
if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, "[]");
}

// Submit report
app.post("/api/report", (req, res) => {
  const report = req.body;
  report.timestamp = new Date().toISOString();

  // Generate unique ticket ID
  const id = "CYB" + Math.floor(100000 + Math.random() * 900000);
  report.ticketId = id;

  const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  reports.push(report);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  res.json({ success: true, ticketId: id });
});

// Get all reports
app.get("/api/reports", (req, res) => {
  const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  res.json({ reports });
});

// Check report status
app.get("/api/status/:ticketId", (req, res) => {
  const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  const found = reports.find(r => r.ticketId === req.params.ticketId);
  if (found) {
    res.json({ success: true, report: found });
  } else {
    res.status(404).json({ success: false, message: "Ticket not found" });
  }
});

// ✅ Enhanced PATCH route for status update + Excel archive
app.patch("/api/reports/:ticketId", (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  let reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  const index = reports.findIndex(r => r.ticketId === ticketId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Report not found" });
  }

  const report = reports[index];
  report.status = status;

  if (status === "Resolved") {
    // Remove from JSON
    reports.splice(index, 1);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

    // Append to Excel
    const resolvedPath = "./resolved_reports.xlsx";
    let wb, ws, data = [];

    if (fs.existsSync(resolvedPath)) {
      const file = XLSX.readFile(resolvedPath);
      ws = file.Sheets[file.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(ws);
      wb = file;
    } else {
      wb = XLSX.utils.book_new();
    }

    data.push(report);
    const newWS = XLSX.utils.json_to_sheet(data);
    const newWB = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWB, newWS, "ResolvedReports");
    XLSX.writeFile(newWB, resolvedPath);
  } else {
    // Just update status
    reports[index] = report;
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
  }

  res.json({ success: true, report });
});

// ✅ Fetch resolved reports
app.get("/api/resolved-reports", (req, res) => {
  const resolvedPath = "./resolved_reports.xlsx";
  if (!fs.existsSync(resolvedPath)) {
    return res.json({ reports: [] });
  }

  const workbook = XLSX.readFile(resolvedPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  res.json({ reports: data });
});

// ✅ Optional: Allow downloading the Excel file
app.get("/api/download-resolved", (req, res) => {
  const resolvedPath = "./resolved_reports.xlsx";
  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).send("No resolved reports available.");
  }
  res.download(resolvedPath);
});

// ✅ Home route
app.get("/", (req, res) => {
  res.send("🚀 Cybercrime Reporting API is running.");
});

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
