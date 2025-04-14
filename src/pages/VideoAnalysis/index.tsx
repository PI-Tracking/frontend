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
  const [selectedCamera, setSelectedCamera] = useState<VideoAnalysis>(
    {} as VideoAnalysis
  );
  const websocket = useDetectionWebSocket();
  const { report } = useReportStore();

  useEffect(() => {
    setSelectedCamera(report.uploads[0]);
    setSuspectImg(mock_suspectimage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!paramReportId) {
    return <h1>No report id given!</h1>;
  }

  if (report.id !== paramReportId) {
    return <h1>Report id does not match!</h1>;
  }

  websocket.connect();
  const changeCamera = function (cameraId: UUID) {
    const videoAnalysis: VideoAnalysis | undefined = report.uploads.find(
      (analysis) => analysis.camera.id == cameraId
    );

    if (videoAnalysis == undefined) return;

    setSelectedCamera(videoAnalysis);
  };

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
            <ListDetections detections={selectedCamera.detections} />
          </div>
        </div>

        <div className={styles.player}>
          {websocket.analysing ? <h1>Video is being analysed...</h1> : <></>}
          <Player videoAnalysis={selectedCamera} controls={true} />
        </div>

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
