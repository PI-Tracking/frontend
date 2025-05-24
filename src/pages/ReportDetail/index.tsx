import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import { getReport, getAnalysisByReportId } from "@api/report";
import { getAnalysisResultsByAnalysisId } from "@api/analysis";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";
import { AnalysisResponseDTO } from "@Types/AnalysisResponseDTO";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./ReportDetail.css";

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

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
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fetchReportAndAnalysis = async () => {
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

        // Fetch report details
        const reportResponse = await getReport(reportId!);
        if (reportResponse.status === 200) {
          setReport(reportResponse.data as ReportResponseDTO);
          
          // Fetch analysis IDs for the report
          const analysisResponse = await getAnalysisByReportId(reportId!);
          if (analysisResponse.status === 200 && analysisResponse.data.analysisIds.length > 0) {
            // Fetch the latest analysis results
            const latestAnalysisId = analysisResponse.data.analysisIds[0];
            const analysisResultsResponse = await getAnalysisResultsByAnalysisId(latestAnalysisId);
            if (analysisResultsResponse.status === 200) {
              setAnalysisResults(analysisResultsResponse.data);
              
              // Set map center based on first detection if available
              if (analysisResultsResponse.data.detections.length > 0) {
                const firstDetection = analysisResultsResponse.data.detections[0];
                if (firstDetection.coordinates && firstDetection.coordinates.length > 0) {
                  setMapCenter([firstDetection.coordinates[0].y, firstDetection.coordinates[0].x]);
                }
              }
            }
          }
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
      fetchReportAndAnalysis();
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

          {analysisResults && (
            <>
              <section className="report-section">
                <h2>Analysis Results</h2>
                <div className="analysis-results">
                  <div className="detections-list">
                    <h3>Detections ({analysisResults.detections.length})</h3>
                    {analysisResults.detections.map((detection, index) => (
                      <div 
                        key={index} 
                        className="detection-item"
                        onClick={() => setSelectedDetection(detection)}
                      >
                        <p>Type: {detection.className}</p>
                        <p>Confidence: {(detection.confidence * 100).toFixed(2)}%</p>
                        <p>Timestamp: {format(new Date(detection.timestamp), 'PPpp')}</p>
                      </div>
                    ))}
                  </div>

                  {analysisResults.segmentations.length > 0 && (
                    <div className="segmentations-list">
                      <h3>Suspect Segmentations ({analysisResults.segmentations.length})</h3>
                      {analysisResults.segmentations.map((segmentation, index) => (
                        <div key={index} className="segmentation-item">
                          <img 
                            src={`data:image/png;base64,${segmentation.mask}`} 
                            alt={`Segmentation ${index + 1}`}
                            className="segmentation-image"
                          />
                          <p>Timestamp: {format(new Date(segmentation.timestamp), 'PPpp')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="report-section">
                <h2>Detection Map</h2>
                <div className="map-container">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {analysisResults.detections.map((detection, index) => (
                      detection.coordinates && detection.coordinates.length > 0 && (
                        <Marker
                          key={index}
                          position={[detection.coordinates[0].y, detection.coordinates[0].x]}
                          eventHandlers={{
                            click: () => setSelectedDetection(detection)
                          }}
                        >
                          <Popup>
                            <div>
                              <h4>{detection.className}</h4>
                              <p>Confidence: {(detection.confidence * 100).toFixed(2)}%</p>
                              <p>Time: {format(new Date(detection.timestamp), 'PPpp')}</p>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                </div>
              </section>
            </>
          )}
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