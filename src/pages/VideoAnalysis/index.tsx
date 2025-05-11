import { useEffect, useState } from "react";
import styles from "./styles.module.css";

/* Default page components */
import Navbar from "@components/Navbar";
import CameraMenuOptions from "@components/CameraMenuOptions";
import noimg from "@assets/noimg.png";

/* Page components */
import ListDetections from "./components/ListDetections";
import ListCameras from "./components/ListCameras";
import Player from "./components/VideoPlayer";
import { VideoAnalysis } from "@Types/VideoAnalysis";

import { UUID } from "@Types/Base";
import { useDetectionWebSocket } from "@hooks/useDetectionWebSocket";
import { useParams } from "react-router-dom";
import useReportStore from "@hooks/useReportStore";

/* MOCK DATA */
import mock_suspectimage from "./mock_data/suspect.png";

type Image = string;
function VideoAnalysisPage() {
  const { id: paramReportId } = useParams();
  const [suspectImg, setSuspectImg] = useState<Image>(noimg);
  const [selectedCamera, setSelectedCamera] = useState<VideoAnalysis[]>([
    {} as VideoAnalysis]
  );
  const websocket = useDetectionWebSocket();
  const { report } = useReportStore();

  console.log(report);
  useEffect(() => {
    websocket.connect(report.uploads[0].analysis_id);
    setSelectedCamera(report.uploads[0]);
    setSuspectImg(mock_suspectimage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeCamera = function (cameraId: UUID) {
    const videoAnalysis: VideoAnalysis = report.uploads.find(
      (analysis: VideoAnalysis) => analysis.camera.id === cameraId
    )!;

    setSelectedCamera(videoAnalysis);
  };

  useEffect(() => {
    if (!websocket.analysing) {
      changeCamera(selectedCamera.camera.id);
    }
  }, [websocket.analysing]); //eslint-disable-line react-hooks/exhaustive-deps

  if (!paramReportId) {
    return (
      <div className={styles.content}>
        <Navbar />
        <h1>No report id given!</h1>;
      </div>
    );
  }

  if (report.id !== paramReportId) {
    return (
      <div className={styles.content}>
        <Navbar />
        <h1>Report id does not match upload id received!</h1>;
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.column}>
          <div className={styles.box}>
            <h3 className={styles.boxTitle}>Selected Suspect</h3>
            <img src={suspectImg} className={styles.suspectImage} />
          </div>

          <div className={styles.box}>
            <h3 className={styles.boxTitle}>Detections</h3>
            {report.uploads.map((analise: VideoAnalysis) =>
              <>
                <h5 style={{ color: "white" }}>{analise.camera.name}:</h5>
                <ListDetections detections={analise.detections} />
              </>
            )}

          </div>
        </div>
        {report.uploads.map((analise: VideoAnalysis) =>
          <div className={styles.player}>
            {websocket.analysing ? (
              <h1 style={{ color: "white" }}>Video is being analysed...</h1>
            ) : (
              <></>
            )}

            <Player videoAnalysis={analise} controls={true} />

          </div>
        )}
        <div className={styles.column}>
          <div className={styles.box} style={{ minWidth: "250px" }}>
            <h3 className={styles.boxTitle}>Cameras</h3>
            <ListCameras
              analysis={report.uploads}
              changeCamera={changeCamera}
            />
          </div>
        </div>

        <div className={styles.menuOptions}>
          <CameraMenuOptions />
        </div>
      </main>
    </div>
  );
}

export default VideoAnalysisPage;
