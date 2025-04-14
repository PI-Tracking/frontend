import {
  ResultsRequest,
  convertBrokerDetectionToAppDetection,
} from "../Types/WebSocketTypes";
import { Detection } from "../Types/Detection";

// websocket service
// handles the connection to the websocket
// handles the reconnection to the websocket
// handles the message handling
// handles the connection status

// ws://localhost:8000/api/v1/ws/{analysisId}

type MessageHandler = (detections: Detection[], analysisId: string) => void;

class DetectionWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor(private baseUrl: string = "ws://localhost:8000") {}

  connect(analysisId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(`${this.baseUrl}/api/v1/ws/${analysisId}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: ResultsRequest = JSON.parse(event.data);
        const appDetections = data.detections.map((detection) =>
          convertBrokerDetectionToAppDetection(detection)
        );

        this.messageHandlers.forEach((handler) =>
          handler(appDetections, data.analysis_id)
        );
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.handleReconnect(analysisId);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private handleReconnect(analysisId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(
        () => this.connect(analysisId),
        this.reconnectTimeout * this.reconnectAttempts
      );
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const detectionWebSocket = new DetectionWebSocket();

export default detectionWebSocket;
