import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";
import { Segmentation } from "@Types/Segmentation";

// hook da websocket de detecção
// interface to use the websocket service

interface UseDetectionWebSocketResult {
  isConnected: boolean;
  analysing: boolean;
  currentAnalysisId: UUID;
  connect: (analysis_id: UUID) => void;
  disconnect: () => void;
}

export function useDetectionWebSocket(): UseDetectionWebSocketResult {
  const { setDetections, setSegmentation } = useReportStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [analysing, setAnalysing] = useState<boolean>(true);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<UUID>("");

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
  }, []);

  const disconnect = useCallback(() => {
    detectionWebSocket.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = detectionWebSocket.onMessage(
      (newDetections, newSegmentation, analysis_id) => {
        console.log("New detections:", newDetections);
        const groupedDetections = newDetections.reduce(
          (acc: { [key: string]: Detection[] }, detection: Detection) => {
            const { video_id } = detection;
            if (!acc[video_id]) {
              acc[video_id] = [];
            }
            acc[video_id].push(detection);
            return acc;
          },
          {}
        );
        const groupedSegmentation = newSegmentation.reduce(
          (
            acc: { [key: string]: Segmentation[] },
            segmentation: Segmentation
          ) => {
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
          const videoDetections = groupedDetections[video_id];
          const videoSegmentation = groupedSegmentation[video_id];
          setDetections(video_id, analysis_id, videoDetections as Detection[]);
          setSegmentation(
            video_id,
            analysis_id,
            videoSegmentation as Segmentation[]
          );
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
  };
}
