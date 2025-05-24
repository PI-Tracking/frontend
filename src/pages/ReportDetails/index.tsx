import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import { getReport, getAnalysisByReportId, getSuspectImage } from "@api/report";
import { getAnalysisResultsByAnalysisId } from "@api/analysis";
import { getAllCameras } from "@api/camera";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";
import { AnalysisResponseDTO } from "@Types/AnalysisResponseDTO";
import { Camera } from "@Types/Camera";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./ReportDetails.css";

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const COIMBRA: [number, number] = [40.202852, -8.410192];

function ReportDetails() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportResponseDTO | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(COIMBRA);
  const [firstDetection, setFirstDetection] = useState<any>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [suspectImage, setSuspectImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportAndAnalysis = async () => {
      try {
        if (!reportId) return;

        // Fetch cameras first
        const camerasResponse = await getAllCameras();
        if (camerasResponse.status === 200) {
          setCameras(camerasResponse.data as Camera[]);
        }

        // Fetch report details
        const reportResponse = await getReport(reportId);
        if (reportResponse.status === 200) {
          const reportData = reportResponse.data as ReportResponseDTO;
          setReport(reportData);
          
          // Fetch suspect image
          try {
            const suspectImageResponse = await getSuspectImage(reportId);
            if (suspectImageResponse.status === 200) {
              setSuspectImage(suspectImageResponse.data as string);
            }
          } catch (error) {
            console.log("No suspect image available");
          }
          
          // Fetch analysis IDs for the report
        const analysisResponse = await getAnalysisByReportId(reportId);
          if (analysisResponse.status === 200 && analysisResponse.data.analysisIds.length > 0) {
            // Fetch the latest analysis results
            const latestAnalysisId = analysisResponse.data.analysisIds[0];
            const analysisResultsResponse = await getAnalysisResultsByAnalysisId(latestAnalysisId);
            if (analysisResultsResponse.status === 200) {
              const results = analysisResultsResponse.data;
              setAnalysisResults(results);
              
              // Set first detection
              if (results.detections.length > 0) {
                setFirstDetection(results.detections[0]);
              }
              
              // Set map center based on first detection's camera location
              if (results.detections.length > 0 && reportData.uploads.length > 0) {
                const firstUpload = reportData.uploads.find(
                  upload => upload.id === results.detections[0].video_id
                );
                if (firstUpload && firstUpload.cameraId) {
                  // Use camera location for map center
                  const camera = cameras.find(
                    cam => cam.id === firstUpload.cameraId
                  );
                  if (camera) {
                    setMapCenter([camera.latitude, camera.longitude]);
                  }
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

  const formatVideoTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toISOString().substr(11, 8);
  };

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
            <h2>Suspect Image</h2>
            <div className="suspect-image-container">
              {suspectImage ? (
                <img 
                  src={`data:image/jpeg;base64,${suspectImage}`} 
                  alt="Suspect" 
                  className="suspect-image"
                />
              ) : (
                <div className="no-suspect-image">
                  No suspect image uploaded
                </div>
              )}
            </div>
          </section>

          <section className="report-section">
            <h2>Uploads ({report.uploads.length})</h2>
            <div className="uploads-grid">
              {report.uploads.map((upload) => {
                const camera = cameras.find(c => c.id === upload.cameraId);
                return (
                  <div key={upload.id} className="upload-card">
                    <div className="upload-preview">
                      <video 
                        src={`/api/v1/reports/${reportId}/uploads/${upload.id}`} 
                        controls 
                        className="upload-video"
                      />
                    </div>
                    <div className="upload-info">
                      <h3>Camera: {camera?.name || 'Unknown'}</h3>
                      <p>Location: {camera ? `${camera.latitude}, ${camera.longitude}` : 'Unknown'}</p>
                      <p>Status: {upload.uploaded ? 'Uploaded' : 'Pending'}</p>
                    </div>
                  </div>
                );
              })}
          </div>
          </section>

          <section className="report-section">
            <h2>Analysis Results</h2>
            {analysisResults ? (
              <div className="analysis-results">
                <div className="detections-list">
                  <h3>Detections</h3>
                  <div className="scrollable-list">
                    {analysisResults.detections.length > 0 ? (
                      analysisResults.detections.map((detection, index) => (
                        <div
                          key={index}
                          className="detection-item"
                          onClick={() => setSelectedDetection(detection)}
                        >
                          <p>Type: {detection.class_name}</p>
                          <p>Time: {formatVideoTime(detection.timestamp)}</p>
                          <p>Confidence: {(detection.confidence * 100).toFixed(2)}%</p>
                        </div>
                      ))
                    ) : (
                      <div className="no-results-message">No detections found</div>
                    )}
                  </div>
                </div>

                <div className="segmentations-list">
                  <h3>Segmentations</h3>
                  <div className="scrollable-list">
                    {analysisResults.segmentations.length > 0 ? (
                      analysisResults.segmentations.map((segmentation, index) => (
                        <div key={index} className="segmentation-item">
                          <img
                            src={`data:image/png;base64,${segmentation.polygon}`}
                            alt={`Segmentation ${index + 1}`}
                            className="segmentation-image"
                          />
                          <p>Time: {formatVideoTime(segmentation.timestamp)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="no-results-message">No segmentations found</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-results-message">
                No analysis results available for this report
              </div>
            )}
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
                {cameras.map((camera) => (
                  <Marker
                    key={camera.id}
                    position={[camera.latitude, camera.longitude]}
                  >
                    <Popup>
                      <div>
                        <h3>{camera.name}</h3>
                        <p>Location: {camera.latitude}, {camera.longitude}</p>
                </div>
                    </Popup>
                  </Marker>
              ))}
              </MapContainer>
            </div>
            {(!analysisResults || analysisResults.detections.length === 0) && (
              <div className="no-results-message">
                No detections found in this report
          </div>
            )}
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

export default ReportDetails; 