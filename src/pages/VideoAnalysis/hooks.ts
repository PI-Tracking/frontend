import { useDetectionWebSocket } from "@hooks/useDetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* MOCK DATA */
import { requestReanalysis } from "@api/analysis";
import SelectedSuspectDTO from "@Types/SelectedSuspectDTO";

export default function useVideoAnalysis() {
  const { id: paramReportId } = useParams();
  const websocket = useDetectionWebSocket();
  const { report, setInitialAnalysisId } = useReportStore();
  const [suspectImg, setSuspectImg] = useState<string | undefined>(undefined);
  const [selectedCamera, setSelectedCamera] = useState<VideoAnalysis | null>(
    null
  );
  const [extractingSuspect, setExtractingSuspect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      // Check if report and uploads exist
      if (report && report.uploads && report.uploads.length > 0) {
        try {
          // Connect to websocket
          websocket.connect(report.uploads[0].analysis_id);
          console.log("Initial camera data:", report.uploads[0]);

          // Set the selected camera with valid data
          setSelectedCamera(report.uploads[0]);
          setSuspectImg(report.suspectImg);
        } catch (error) {
          console.error("Error initializing video analysis:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn("Report or uploads not available");
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!websocket.analysing && selectedCamera) {
      changeCamera(selectedCamera.camera.id);
    }
  }, [websocket.analysing]); //eslint-disable-line react-hooks/exhaustive-deps

  const changeCamera = function (cameraId: UUID) {
    if (!report.uploads || !websocket.currentAnalysisId) {
      console.warn(
        "Cannot change camera: report uploads or analysisId not available"
      );
      return;
    }

    const videoAnalysis = report.uploads.find(
      (analysis) =>
        analysis.camera.id === cameraId &&
        analysis.analysis_id === websocket.currentAnalysisId
    );

    if (videoAnalysis) {
      console.log("Changing camera to:", videoAnalysis);
      setSelectedCamera(videoAnalysis);
    } else {
      console.warn(`No video analysis found for camera ${cameraId}`);
    }
  };
  const activateExtractSuspect = function () {
    setExtractingSuspect(true);
  };

  const requestNewReanalysis = async function (
    x: number,
    y: number,
    timestamp: number
  ) {
    websocket.disconnect();
    setExtractingSuspect(false);
    console.log("x:", x, "y:", y, "ts:", timestamp);
    const response = await requestReanalysis(report.id, {
      videoId: selectedCamera!.video_id,
      timestamp: timestamp * 1_000, // convert to ms
      x: x,
      y: y,
    } as SelectedSuspectDTO);
    console.log(response);

    setInitialAnalysisId((response.data as { analysisId: string }).analysisId);

    if (response.status !== 200)
      alert("Something went wrong requesting reanalysis");

    const data = response.data as { analysisId: string };
    websocket.connect(data.analysisId);

    // Find the segmentation at the clicked timestamp
    const segmentation = selectedCamera?.segmentations.find(
      (s) => Math.abs(s.timestamp - timestamp * 1000) < 200
    );
    if (segmentation) {
      setSuspectImg(``);
    }
  };

  return {
    paramReportId,
    suspectImg,
    selectedCamera,
    websocket,
    report,
    changeCamera,
    extractingSuspect,
    activateExtractSuspect,
    requestNewReanalysis,
    isLoading,
  };
}
