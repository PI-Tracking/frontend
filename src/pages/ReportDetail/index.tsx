import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import { getReport } from "@api/report";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "./ReportDetail.css";

// Mock data for testing
const mockReports: Record<string, ReportResponseDTO> = {
  "mock-report-1": {
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
  "mock-report-2": {
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
};

function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Check if we're using mock data
        if (reportId && reportId.startsWith('mock-report-')) {
          const mockReport = mockReports[reportId];
          if (mockReport) {
            setReport(mockReport);
            setLoading(false);
            return;
          }
        }

        // If not mock data or mock report not found, fetch from API
        const response = await getReport(reportId!);
        if (response.status === 200) {
          setReport(response.data as ReportResponseDTO);
        } else {
          toast.error("Failed to fetch report details");
        }
      } catch (error) {
        toast.error("Error loading report");
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="report-detail-container">
        <Navbar />
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-detail-container">
        <Navbar />
        <div className="error-message">Report not found</div>
      </div>
    );
  }

  return (
    <div className="report-detail-container">
      <Navbar />
      <div className="report-detail-content">
        <div className="report-header">
          <h1>{report.name}</h1>
          <div className="report-meta">
            <span>Created by: {report.creator.username}</span>
            <span>Badge ID: {report.creator.badgeId}</span>
          </div>
        </div>

        <div className="report-sections">
          <section className="report-section">
            <h2>Uploads ({report.uploads.length})</h2>
            <div className="uploads-grid">
              {report.uploads.map((upload) => (
                <div key={upload.id} className="upload-card">
                  <div className="upload-preview">
                    {upload.uploadUrl.endsWith('.mp4') ? (
                      <video src={upload.uploadUrl} controls />
                    ) : (
                      <img src={upload.uploadUrl} alt={`Upload ${upload.id}`} />
                    )}
                  </div>
                  <div className="upload-info">
                    <h3>Upload {upload.id}</h3>
                    <p>Camera ID: {upload.cameraId}</p>
                    <p>Status: {upload.uploaded ? 'Uploaded' : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h2>Analysis Results</h2>
            <div className="analysis-results">
              {/* Add analysis results here when available */}
              <p>Analysis results will be displayed here</p>
            </div>
          </section>
        </div>

        <div className="report-actions">
          <button 
            className="back-button"
            onClick={() => navigate('/reports')}
          >
            Back to Reports
          </button>
          <button 
            className="view-map-button"
            onClick={() => navigate(`/map-tracking?reportId=${report.id}`)}
          >
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail; 