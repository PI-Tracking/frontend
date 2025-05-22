import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./ReportsPage.css";
import useReport from "@hooks/useReportStore";
import { useNavigate } from "react-router-dom";
import { Report } from "@Types/Report";
import { useState, useEffect } from "react";
import { getAllReports, getReport } from "@api/report";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";

//To surpass error of reportData being ApiError or ReportResponseDTO
function isReportResponseDTO(data: unknown): data is ReportResponseDTO {
  if (!data || typeof data !== "object") return false;

  const report = data as Record<string, unknown>;

  return (
    typeof report.id === "string" &&
    typeof report.name === "string" &&
    Array.isArray(report.uploads)
  );
}

function ReportsPage() {
  const { setReport } = useReport();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportResponseDTO[]>([]);

  const selectReport = (report: ReportResponseDTO) => {
    if (!report) return;
    console.log("Selected report ID:", report.id);
    //Transform the report to match the Report type
    const transformedReport: Report = {
      id: report.id,
      name: report.name,
      creator: {
        badgeId: "",
        username: "",
        email: "",
        active: false,
        reports: [],
        admin: false,
        credentialsNonExpired: false,
        accountNonExpired: false,
        accountNonLocked: false,
        authorities: [],
        enabled: false,
      },
      createdAt: new Date(),
      uploads: [],
    };
    setReport(transformedReport);
    navigate(`/map-tracking`);
  };

  useEffect(() => {
    const fectchReports = async () => {
      // Fetch reports from the API
      setReports([]);
      const response = await getAllReports();
      console.log("Reports response:", response);
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          for (const report of response.data) {
            // Call getReport for each report
            const reportResponse = await getReport(report.id);
            console.log("Report response:", reportResponse);
            if (reportResponse.status === 200) {
              const reportData = reportResponse.data;
              if (
                reportData &&
                isReportResponseDTO(reportData) &&
                !reports.includes(reportData)
              ) {
                setReports((prevReports) =>
                  [reportData, ...prevReports].filter(
                    (report, index, self) =>
                      index === self.findIndex((r) => r.id === report.id)
                  )
                );
              } else {
                console.error("No data found for report:", report.id);
              }
            } else {
              console.error(
                "Failed to fetch report details:",
                reportResponse.data
              );
            }
          }
        } else {
          console.error("Unexpected response data format:", response.data);
        }
      } else {
        console.error("Failed to fetch reports:", response.data);
      }
    };
    if (reports.length === 0) {
      // Fetch reports only if the reports array is empty
      fectchReports();
    }
  }, []);

  useEffect(() => {
    console.log("Fetched reports:", reports);
  }, [reports]);

  return (
    <div className="container">
      <Navbar />
      <section className="reports-section">
        <h1 className="reports-title">Reports</h1>
        <div className="reports-content">
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <h2 className="report-date">{report.name}</h2>
                <p className="report-creator">
                  Creator: {report.creator.badgeId}
                </p>
                <p className="report-uploads">
                  Uploads: {report.uploads.length}
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
