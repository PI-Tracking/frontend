import { UUID } from "@Types/Base";
import styles from "./ListCameras.module.css";
import { VideoAnalysis } from "@Types/VideoAnalysis";

import noimg from "@assets/noimg.png";

type video = string | File;

interface IListCameras {
  changeCamera: (camera_id: UUID) => void;
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
          <div className={styles.listElement} key={camera.id}>
            <img src={currentFrame} className={styles.frame} />
            <div
              className={styles.cameraInfo}
              onClick={() => {
                /* Open Accordion */
              }}
              onDoubleClick={() => {
                changeCamera(camera.id);
              }}
            >
              <p className={styles.cameraName}>{camera.name}</p>
              <p className={styles.cameraId}>ID: {camera.id}</p>
              <p className={styles.cameraDetections}>
                {analise.detections.length} deteções
              </p>

              <div className={styles.accordion}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListCameras;
