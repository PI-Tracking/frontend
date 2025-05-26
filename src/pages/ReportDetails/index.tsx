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
import Select from "@components/Select";

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
  const [allAnalysisResults, setAllAnalysisResults] = useState<Map<string, AnalysisResponseDTO>>(new Map());
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(COIMBRA);
  const [firstDetection, setFirstDetection] = useState<any>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [suspectImage, setSuspectImage] = useState<string | null>(null);
  const [processedAnalysisIds, setProcessedAnalysisIds] = useState<Set<string>>(new Set());

  // Get current analysis results based on selection
  const currentAnalysisResults = selectedAnalysisId ? allAnalysisResults.get(selectedAnalysisId) : null;

  // Function to add new analysis results
  const addNewAnalysisResults = (newResults: AnalysisResponseDTO) => {
    setAllAnalysisResults(prev => {
      const newMap = new Map(prev);
      newMap.set(newResults.analysisId, newResults);
      return newMap;
    });
  };

  // Function to check for new analyses
  const checkForNewAnalyses = async () => {
    if (!reportId) return;

    try {
      const analysisResponse = await getAnalysisByReportId(reportId);
      if (analysisResponse.status === 200) {
        const newAnalysisIds = analysisResponse.data.analysisIds.filter(
          id => !processedAnalysisIds.has(id)
        );

        for (const analysisId of newAnalysisIds) {
          const resultsResponse = await getAnalysisResultsByAnalysisId(analysisId);
          if (resultsResponse.status === 200) {
            addNewAnalysisResults(resultsResponse.data as AnalysisResponseDTO);
            setProcessedAnalysisIds(prev => new Set([...prev, analysisId]));
            
            // Set the first analysis as selected if none is selected
            if (!selectedAnalysisId) {
              setSelectedAnalysisId(analysisId);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking for new analyses:", error);
    }
  };

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
          
          // Initial check for analyses
          await checkForNewAnalyses();
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

  // Set up polling for new analyses
  useEffect(() => {
    if (!reportId) return;

    const pollInterval = setInterval(checkForNewAnalyses, 5000); // Check every 5 seconds

    return () => clearInterval(pollInterval);
  }, [reportId, processedAnalysisIds]);

  // Update first detection and map center when new detections are added
  useEffect(() => {
    if (currentAnalysisResults && currentAnalysisResults.detections.length > 0 && !firstDetection && report) {
      setFirstDetection(currentAnalysisResults.detections[0]);
      
      if (report.uploads && report.uploads.length > 0) {
        const firstUpload = report.uploads.find(
          upload => upload.id === currentAnalysisResults.detections[0].videoId
        );
        if (firstUpload?.cameraId) {
          const camera = cameras.find(cam => cam.id === firstUpload.cameraId);
          if (camera) {
            setMapCenter([camera.latitude, camera.longitude]);
          }
        }
      }
    }
  }, [currentAnalysisResults, firstDetection, report, cameras]);

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
                        src={`http://localhost:8080/api/v1/reports/${reportId}/uploads/${upload.id}/video`} 
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
            {allAnalysisResults.size > 0 ? (
              <>
                <div className="analysis-filter" style={{ marginBottom: '24px' }}>
                  <Select
                    value={selectedAnalysisId || ''}
                    onChange={(e) => {
                      setSelectedAnalysisId(e.target.value);
                      // Don't clear selectedDetection when changing analysis
                    }}
                    options={Array.from(allAnalysisResults.keys()).map(id => ({
                      value: id,
                      label: `Analysis ${id.slice(0, 8)}...`
                    }))}
                    placeholder="Select Analysis"
                  />
                </div>
                {currentAnalysisResults ? (
                  <div className="analysis-results">
                    <div className="detections-list">
                      <h3>Detections</h3>
                      <div className="scrollable-list">
                        {currentAnalysisResults.detections.length > 0 ? (
                          currentAnalysisResults.detections.map((detection, index) => (
                            <div
                              key={index}
                              className="detection-item"
                              onClick={() => setSelectedDetection(detection)}
                            >
                              <p>Type: {
                                detection.className === 'weapon' ? 'Weapon' :
                                detection.className === 'knife' ? 'Knife' :
                                detection.className === 'face' ? 'Face' :
                                detection.className
                              }</p>
                              <p>Time: {formatVideoTime(detection.timestamp)}</p>
                              <p>Confidence: {(detection.confidence * 100).toFixed(2)}%</p>
                              <p>Camera: {
                                (() => {
                                  const upload = report.uploads.find(u => u.id === detection.videoId);
                                  return cameras.find(c => c.id === upload?.cameraId)?.name || 'Unknown';
                                })()
                              }</p>
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
                        {currentAnalysisResults.segmentations.length > 0 ? (
                          currentAnalysisResults.segmentations.map((segmentation, index) => (
                            <div 
                              key={index} 
                              className="segmentation-item"
                              onClick={() => setSelectedDetection(segmentation)}
                            >
                              <img
                                src={`data:image/png;base64,${segmentation.polygon}`}
                                alt={`Segmentation ${index + 1}`}
                                className="segmentation-image"
                              />
                              <div className="segmentation-info">
                                <p>Time: {formatVideoTime(segmentation.timestamp)}</p>
                                <p>Camera: {
                                  (() => {
                                    const upload = report.uploads.find(u => u.id === segmentation.videoId);
                                    return cameras.find(c => c.id === upload?.cameraId)?.name || 'Unknown';
                                  })()
                                }</p>
                              </div>
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
                    Select an analysis to view results
                  </div>
                )}
              </>
            ) : (
              <div className="no-results-message">
                No analysis results available for this report
              </div>
            )}
          </section>

          <section className="report-section">
            <h2>Selected Person</h2>
            <div className="suspect-image-container">
              {selectedDetection ? (
                <div>
                  <img 
                    src={`data:image/png;base64,${selectedDetection.polygon}`}
                    alt="Selected Person" 
                    className="suspect-image"
                  />
                  <div className="detection-info">
                    <p>Time: {formatVideoTime(selectedDetection.timestamp)}</p>
                    <p>Camera: {
                      (() => {
                        const upload = report.uploads.find(u => u.id === selectedDetection.videoId);
                        return cameras.find(c => c.id === upload?.cameraId)?.name || 'Unknown';
                      })()
                    }</p>
                  </div>
                </div>
              ) : (
                <div className="no-suspect-image">
                  Click on a segmentation to view person
                </div>
              )}
            </div>
          </section>

          <section className="report-section">
            <h2>Camera Map</h2>
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
            View Detections on Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportDetails; 