import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./ReportsPage.css";
import useReport from "@hooks/useReportStore";
import { useNavigate } from "react-router-dom";
import { Report } from "@Types/Report";

function ReportsPage() {
  const { setReport } = useReport();
  const navigate = useNavigate();

  const reports = [
    {
      id: "132",
      name: "Rua do Mac",
      creator: "John Doe",
      createdAt: "2023-10-01",
      uploads: [
        { id: 1, name: "Upload 1" },
        { id: 2, name: "Upload 2" },
      ],
    },
  ];

  const selectReport = (report: Report) => {
    if (!report) return;
    console.log("Selected report ID:", report.id);
    setReport(report);
    navigate(`/map-tracking`);
  };

  return (
    <div className="container">
      <Navbar />
      <section className="reports-section">
        <h1 className="reports-title">Reports</h1>
        <div className="reports-content">
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <h2 className="report-name">{report.name}</h2>
                <p className="report-creator">Created by: {report.creator}</p>
                <p className="report-date">Created at: {report.createdAt}</p>
                <p className="uploads-size">
                  Analysed videos: {report.uploads.length}
                </p>
                <button
                  className="view-report-button"
                  onClick={() => selectReport(report)}
                >
                  View Movements
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default ReportsPage;
