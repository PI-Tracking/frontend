import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Segmentation } from "@Types/Segmentation";
import { DetectionResult, SegmentationResult } from "@Types/WebSocketTypes";
import apiClient from "@api/api";

// hook da websocket de detecção
// interface to use the websocket service

interface UseDetectionWebSocketResult {
  isConnected: boolean;
  analysing: boolean;
  currentAnalysisId: UUID;
  connect: (analysis_id: UUID) => void;
  disconnect: () => void;
  suspectImg?: string;
}

export function useDetectionWebSocket(): UseDetectionWebSocketResult {
  const { setDetections, setSegmentation } = useReportStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [analysing, setAnalysing] = useState<boolean>(true);
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

  const connect = useCallback((analysis_id: UUID) => {
    setCurrentAnalysisId(analysis_id);
    detectionWebSocket.connect(analysis_id);

    setAnalysing(true);
  }, []);

  const disconnect = useCallback(() => {
    detectionWebSocket.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = detectionWebSocket.onMessage(
      async (newDetections, newSegmentation, analysis_id) => {
        console.log("New detections:", newDetections);
        const groupedDetections = newDetections.reduce<{ [key: string]: DetectionResult[] }>(
          (acc, detection) => {
            const { video_id } = detection;
            if (!acc[video_id]) {
              acc[video_id] = [];
            }
            acc[video_id].push(detection);
            return acc;
          },
          {}
        );
        const groupedSegmentation = newSegmentation.reduce<{ [key: string]: SegmentationResult[] }>(
          (acc, segmentation) => {
            const { video_id } = segmentation;
            if (!acc[video_id]) {
              acc[video_id] = [];
            }
            acc[video_id].push(segmentation);
            return acc;
          },
          {}
        );
        for (const video_id in groupedDetections) {
          const videoDetections = groupedDetections[video_id].map(d => ({
            ...d,
            className: d.class_name,
            videoId: d.video_id
          }));
          setDetections(video_id, analysis_id, videoDetections);
        }
        for (const video_id in groupedSegmentation) {
          const videoSegmentation = groupedSegmentation[video_id].map(s => ({
            ...s,
            videoId: s.video_id
          }));
          setSegmentation(video_id, analysis_id, videoSegmentation);
          if (videoSegmentation.length > 0) {
            // Get the suspect image from the backend
            try {
              const response = await apiClient.get(`/reports/${analysis_id}/suspect-image`);
              if (response.status === 200) {
                const base64Image = response.data;
                setSuspectImg(`data:image/png;base64,${base64Image}`);
              }
            } catch (error) {
              console.error('Error fetching suspect image:', error);
            }
          }
        }
        setAnalysing(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    analysing,
    currentAnalysisId,
    connect,
    disconnect,
    suspectImg,
  };
}
