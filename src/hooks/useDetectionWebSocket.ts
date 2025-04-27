import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { Detection } from "@Types/Detection";

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
  const { setDetections } = useReportStore();
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
      (newDetections, analysis_id) => {
        console.log(newDetections);
        setDetections(
          newDetections[0].video_id,
          analysis_id,
          newDetections as Detection[]
        );
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
