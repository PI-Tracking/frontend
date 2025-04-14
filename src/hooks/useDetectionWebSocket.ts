import { useState, useEffect, useCallback } from "react";
import detectionWebSocket from "../websockets/DetectionWebSocket";
import useReportStore from "@hooks/useReportStore";

// hook da websocket de detecção
// interface to use the websocket service

interface UseDetectionWebSocketResult {
  isConnected: boolean;
  analysing: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useDetectionWebSocket(): UseDetectionWebSocketResult {
  const { report, setDetections } = useReportStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [analysing, setAnalysing] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(detectionWebSocket.isConnected());
    };

    checkConnection();

    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(() => {
    detectionWebSocket.connect(report.id);
  }, [report.id]);

  const disconnect = useCallback(() => {
    detectionWebSocket.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = detectionWebSocket.onMessage((newDetections, id) => {
      setDetections(id, newDetections);
      setAnalysing(false);
    });

    return () => {
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    analysing,
    connect,
    disconnect,
  };
}
