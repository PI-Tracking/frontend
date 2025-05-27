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
  const [loading, setLoading] = useState(true);

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

  const viewReportDetails = (report: ReportResponseDTO) => {
    if (!report) return;
    navigate(`/report-details/${report.id}`);
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Fetch reports from the API
        const response = await getAllReports();
        console.log("Reports response:", response);
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            const reportsData: ReportResponseDTO[] = [];
            for (const report of response.data) {
              // Call getReport for each report
              const reportResponse = await getReport(report.id);
              console.log("Report response:", reportResponse);
              if (reportResponse.status === 200) {
                const reportData = reportResponse.data;
                if (reportData && isReportResponseDTO(reportData)) {
                  reportsData.push(reportData);
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
            // Sort reports by creation date (newest first)
            reportsData.sort((a, b) => {
              const dateA = new Date(a.name);
              const dateB = new Date(b.name);
              return dateB.getTime() - dateA.getTime();
            });
            setReports(reportsData);
          } else {
            console.error("Unexpected response data format:", response.data);
          }
        } else {
          console.error("Failed to fetch reports:", response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="reports-section">
          <div className="loading-message">Loading reports...</div>
        </div>

        <div className="menu-options">
          <CameraMenuOptions />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <section className="reports-section">
        <h1 className="reports-title">Reports ({reports.length})</h1>
        <div className="reports-content">
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <h2 className="report-name">{report.name}</h2>
                <p className="report-creator">
                  Creator: {report.creator.username}
                </p>
                <p className="report-creator">
                  Badge ID: {report.creator.badgeId}
                </p>
                <p className="report-uploads">
                  Uploads: {report.uploads.length}
                </p>
                <div className="report-actions">
                  <button
                    className="view-report-button"
                    onClick={() => selectReport(report)}
                  >
                    View Movements
                  </button>
                  <button
                    className="view-details-button"
                    onClick={() => viewReportDetails(report)}
                  >
                    View Details
                  </button>
                </div>
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
