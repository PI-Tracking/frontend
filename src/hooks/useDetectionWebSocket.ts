import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { DetectionResult, SegmentationResult } from "@Types/WebSocketTypes";
import apiClient from "@api/api";
import { useParams } from "react-router-dom";

// hook da websocket de detecção
// interface to use the websocket service

interface UseDetectionWebSocketResult {
  isConnected: boolean;
  analysing: boolean;
  setAnalysing: (value: boolean) => void;
  currentAnalysisId: UUID;
  connect: (analysis_id: UUID) => void;
  disconnect: () => void;
  suspectImg?: string;
}

function useDetectionWebSocket(): UseDetectionWebSocketResult {
  const { reportId } = useParams<{ reportId: string }>();
  const { setDetections, setSegmentation } = useReportStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [analysing, setAnalysing] = useState<boolean>(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<UUID>("");
  const [suspectImg, setSuspectImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(detectionWebSocket.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(
    (analysis_id: UUID) => {
      setCurrentAnalysisId(analysis_id);
      detectionWebSocket.connect(analysis_id);
    },
    [setCurrentAnalysisId]
  );

  const disconnect = useCallback(() => {
    detectionWebSocket.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = detectionWebSocket.onMessage(
      async (newDetections, newSegmentation, analysis_id) => {
        console.log("New detections:", newDetections);
        const groupedDetections = newDetections.reduce<{
          [key: string]: DetectionResult[];
        }>((acc, detection) => {
          const { video_id } = detection;
          if (!acc[video_id]) {
            acc[video_id] = [];
          }
          acc[video_id].push(detection);
          return acc;
        }, {});
        const groupedSegmentation = newSegmentation.reduce<{
          [key: string]: SegmentationResult[];
        }>((acc, segmentation) => {
          const { video_id } = segmentation;
          if (!acc[video_id]) {
            acc[video_id] = [];
          }
          acc[video_id].push(segmentation);
          return acc;
        }, {});
        for (const video_id in groupedDetections) {
          const videoDetections = groupedDetections[video_id].map((d) => ({
            ...d,
            className: d.class_name,
            videoId: d.video_id,
          }));
          setDetections(video_id, analysis_id, videoDetections);
        }
        for (const video_id in groupedSegmentation) {
          const videoSegmentation = groupedSegmentation[video_id].map((s) => ({
            ...s,
            videoId: s.video_id,
          }));
          setSegmentation(video_id, analysis_id, videoSegmentation);
          if (videoSegmentation.length > 0 && reportId) {
            // Convert polygon to image and save it
            try {
              const polygon = videoSegmentation[0].polygon;
              if (polygon && polygon.length > 0) {
                // Create a canvas to draw the polygon
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  // Set canvas size (adjust as needed)
                  canvas.width = 640;
                  canvas.height = 480;

                  // Draw the polygon
                  ctx.beginPath();
                  ctx.moveTo(polygon[0][0], polygon[0][1]);
                  for (let i = 1; i < polygon.length; i++) {
                    ctx.lineTo(polygon[i][0], polygon[i][1]);
                  }
                  ctx.closePath();
                  ctx.fillStyle = "white";
                  ctx.fill();

                  // Convert canvas to blob
                  canvas.toBlob(async (blob) => {
                    if (blob) {
                      // Create a file from the blob
                      const file = new File([blob], "suspect.png", {
                        type: "image/png",
                      });

                      // Create form data
                      const formData = new FormData();
                      formData.append("faceImage", file);

                      // Save the suspect image
                      const response = await apiClient.post(
                        `/analysis/face-detection/${reportId}`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );

                      if (response.status === 200) {
                        // Get the suspect image from the backend
                        const imageResponse = await apiClient.get(
                          `/reports/${reportId}/suspect-image`
                        );
                        if (imageResponse.status === 200) {
                          const base64Image = imageResponse.data;
                          setSuspectImg(`data:image/png;base64,${base64Image}`);
                        }
                      }
                    }
                  }, "image/png");
                }
              }
            } catch (error) {
              console.error("Error saving suspect image:", error);
            }
          }
        }
        setAnalysing(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [reportId]); // Add reportId to dependencies

  return {
    isConnected,
    setAnalysing,
    analysing,
    currentAnalysisId,
    connect,
    disconnect,
    suspectImg,
  };
}
export { useDetectionWebSocket, type UseDetectionWebSocketResult };
