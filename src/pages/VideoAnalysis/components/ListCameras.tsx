import styles from "./ListCameras.module.css";
import { VideoAnalysis } from "../types/Report";

import noimg from "@assets/noimg.png";

type video = string;

interface IListCameras {
  changeCamera: (camera_id: number) => void;
  analysis: VideoAnalysis[];
}

const getFrame = function (video: video, timestamp: number) {
  if (!video || !timestamp) {
    return noimg;
  }

  return noimg;
};

function ListCameras({ analysis, changeCamera }: IListCameras) {
  return (
    <div className={styles.list}>
      {analysis.map((analise) => {
        const currentFrame = getFrame(analise.video, analise.currentTimestamp);
        const camera = analise.camera;

        return (
          <div className={styles.camera} key={camera.id}>
            <div className={styles.frame}>
              <img src={currentFrame} />
            </div>
            <div
              className={styles.cameraInfo}
              onClick={() => {
                /* Open Accordion */
              }}
              onDoubleClick={() => {
                changeCamera(camera.id);
              }}
            >
              <span className={styles.cameraName}>{camera.name}</span>
              <span className={styles.cameraId}>ID: {camera.id}</span>
              <span className={styles.cameraDetectionsl}>
                {analise.detections.length} deteções
              </span>

              <div className={styles.accordion}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListCameras;
