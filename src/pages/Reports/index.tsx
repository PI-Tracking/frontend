import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./ReportsPage.css";
import useReport from "@hooks/useReportStore";
import { useNavigate } from "react-router-dom";
import { Report } from "@Types/Report";
import { useState, useEffect } from "react";
import { getAllReports, getReport } from "@api/report";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";

// Mock data for testing
const mockReports: ReportResponseDTO[] = [
  {
    id: "mock-report-1",
    name: "Test Report 1",
    creator: {
      badgeId: "12345",
      username: "testuser1",
      email: "test1@example.com",
      active: true,
      reports: [],
      admin: false,
      credentialsNonExpired: true,
      accountNonExpired: true,
      accountNonLocked: true,
      authorities: [],
      enabled: true
    },
    uploads: [
      {
        id: "upload-1",
        cameraId: "camera-1",
        uploadUrl: "https://example.com/video1.mp4",
        uploaded: true
      }
    ]
  },
  {
    id: "mock-report-2",
    name: "Test Report 2",
    creator: {
      badgeId: "67890",
      username: "testuser2",
      email: "test2@example.com",
      active: true,
      reports: [],
      admin: false,
      credentialsNonExpired: true,
      accountNonExpired: true,
      accountNonLocked: true,
      authorities: [],
      enabled: true
    },
    uploads: [
      {
        id: "upload-2",
        cameraId: "camera-2",
        uploadUrl: "https://example.com/image1.jpg",
        uploaded: true
      }
    ]
  }
];

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
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data

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

  const handleViewDetails = (report: ReportResponseDTO) => {
    if (useMockData) {
      // For mock data, use the mock-report-1 or mock-report-2 ID
      navigate(`/reports/${report.id}`);
    } else {
      navigate(`/reports/${report.id}`);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (useMockData) {
        // Use mock data for testing
        setReports(mockReports);
        return;
      }

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
              if (reportData && isReportResponseDTO(reportData) && !reports.includes(reportData)) {
                setReports((prevReports) =>
                  [reportData, ...prevReports].filter((report, index, self) =>
                    index === self.findIndex(r => r.id === report.id))
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
      fetchReports();
    }
  }, [useMockData]); // Add useMockData to dependencies

  useEffect(() => {
    console.log("Fetched reports:", reports);
  }, [reports]);

  return (
    <div className="container">
      <Navbar />
      <section className="reports-section">
        <h1 className="reports-title">Reports {reports.length}</h1>
        <div className="reports-content">
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <h2 className="report-name">{report.name}</h2>
                <p className="report-date">Created by: {report.creator.username}</p>
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
                    onClick={() => handleViewDetails(report)}
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
