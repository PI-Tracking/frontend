import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import { Detection } from "../Types/Detection";

// hook da websocket de detecção
// interface to use the websocket service

interface UseDetectionWebSocketResult {
  detections: Detection[];
  analysisId: string | null;
  isConnected: boolean;
  connect: (analysisId: string) => void;
  disconnect: () => void;
}

export function useDetectionWebSocket(): UseDetectionWebSocketResult {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(detectionWebSocket.isConnected());
    };

    checkConnection();

    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  const connect = useCallback((id: string) => {
    setAnalysisId(id);
    detectionWebSocket.connect(id);
  }, []);

  const disconnect = useCallback(() => {
    detectionWebSocket.disconnect();
    setAnalysisId(null);
    setDetections([]);
  }, []);

  useEffect(() => {
    const unsubscribe = detectionWebSocket.onMessage((newDetections, id) => {
      setDetections(newDetections);
      setAnalysisId(id);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    detections,
    analysisId,
    isConnected,
    connect,
    disconnect,
  };
}
