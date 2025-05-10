import { DetectionResult, ResultsRequest } from "@Types/WebSocketTypes";

// websocket service
// handles the connection to the websocket
// handles the reconnection to the websocket
// handles the message handling
// handles the connection status

// ws://localhost:8000/api/v1/ws/{analysisId}

type MessageHandler = (
  detections: DetectionResult[],
  analysisId: string
) => void;

class DetectionWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout = 1000;

  constructor(private baseUrl: string = "ws://localhost:8001") {}

  connect(analysisId: string) {
    this.ws = new WebSocket(`${this.baseUrl}/api/v1/ws/${analysisId}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: ResultsRequest = JSON.parse(event.data);

        console.log("Received raw data: ", data);

        this.messageHandlers.forEach((handler) => {
          console.log("Passed to handler");
          handler(data.detections, data.analysis_id);
        });
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
