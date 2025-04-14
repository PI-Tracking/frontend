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
import { Report, VideoAnalysis } from "@Types/Report";
import { Detection, DetectionType } from "@Types/Detection";

/* MOCK DATA */
import mock_video from "./mock_data/video.mp4";
import mock_suspectimage from "./mock_data/suspect.png";
import Loading from "@components/Loading";

type Image = string;
function VideoAnalysisPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [suspectImg, setSuspectImg] = useState<Image>(noimg);
  const [selectedCamera, setSelectedCamera] = useState<VideoAnalysis>(
    {} as VideoAnalysis
  );

  /* Fetch report */
  useEffect(() => {
    const detectionList: Detection[] = [
      {
        detection_box: {
          points: [
            [10, 10],
            [230, 230],
          ],
        },
        type: DetectionType.SUSPECT,
      },
    ];

    const mock_report = {
      id: 10,
      reportAnalysis: [
        {
          camera: { id: 137, name: "Solum" },
          video: mock_video,
          currentTimestamp: 0,
          detections: detectionList,
        } as VideoAnalysis,
        {
          camera: { id: 138, name: "Macdonalds Solum" },
          video: mock_video,
          currentTimestamp: 0,
          detections: detectionList,
        } as VideoAnalysis,
        {
          camera: { id: 238, name: "Polo 2-2" },
          video: mock_video,
          currentTimestamp: 0,
          detections: detectionList,
        } as VideoAnalysis,
      ],
    };

    setReport(mock_report);
    setSuspectImg(mock_suspectimage);
    setSelectedCamera(mock_report.reportAnalysis[0]);
  }, []);

  if (report == null) {
    return <Loading />;
  }

  const changeCamera = function (cameraId: number) {
    const videoAnalysis: VideoAnalysis | undefined = report.reportAnalysis.find(
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
          <Player videoAnalysis={selectedCamera} controls={true} />
        </div>

        <div className={styles.column}>
          <div className={styles.box} style={{ minWidth: "250px" }}>
            <h3 className={styles.boxTitle}>Cameras</h3>
            <ListCameras
              analysis={report.reportAnalysis}
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
