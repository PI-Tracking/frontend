import { useDetectionWebSocket } from "@hooks/useDetectionWebSocket";
import useReportStore from "@hooks/useReportStore";
import { UUID } from "@Types/Base";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* MOCK DATA */
import mock_suspectimage from "./mock_data/suspect.png";
import noimg from "@assets/noimg.png";
import { requestReanalysis } from "@api/analysis";
import SelectedSuspectDTO from "@Types/SelectedSuspectDTO";

export default function useVideoAnalysis() {
  const { id: paramReportId } = useParams();
  const websocket = useDetectionWebSocket();
  const { report } = useReportStore();
  const [suspectImg, setSuspectImg] = useState<string>(noimg);
  const [selectedCamera, setSelectedCamera] = useState<VideoAnalysis>(
    {} as VideoAnalysis
  );
  const [extractingSuspect, setExtractingSuspect] = useState<boolean>(false);

  useEffect(() => {
    websocket.connect(report.uploads[0].analysis_id);
    setSelectedCamera(report.uploads[0]);
    setSuspectImg(mock_suspectimage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!websocket.analysing) {
      changeCamera(selectedCamera.camera.id);
    }
  }, [websocket.analysing]); //eslint-disable-line react-hooks/exhaustive-deps

  const changeCamera = function (cameraId: UUID) {
    const videoAnalysis: VideoAnalysis = report.uploads.find(
      (analysis) => analysis.camera.id === cameraId
    )!;

    setSelectedCamera(videoAnalysis);
  };

  const activateExtractSuspect = function () {
    setExtractingSuspect(true);
  };

  const requestNewReanalysis = function (
    x: number,
    y: number,
    timestamp: number
  ) {
    requestReanalysis(report.id, {
      videoId: selectedCamera.camera.id,
      frame: timestamp,
      x: x,
      y: y,
    } as SelectedSuspectDTO);
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
  };
}
