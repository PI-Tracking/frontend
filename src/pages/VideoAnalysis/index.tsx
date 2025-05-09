import styles from "./styles.module.css";

/* Default page components */
import Navbar from "@components/Navbar";
import CameraMenuOptions from "@components/CameraMenuOptions";

/* Page components */
import ListDetections from "./components/ListDetections";
import ListCameras from "./components/ListCameras";
import Player from "./components/VideoPlayer";
import useVideoAnalysis from "./hooks";

function VideoAnalysisPage() {
  const {
    // data
    paramReportId,
    report,
    selectedCamera,
    suspectImg,
    websocket,
    extractingSuspect,
    // functions
    changeCamera,
    activateExtractSuspect,
    requestNewReanalysis,
  } = useVideoAnalysis();

  if (!paramReportId) {
    return (
      <div className={styles.content}>
        <Navbar />
        <main className={styles.main}>
          <h1>Invalid reportId!</h1>;
        </main>
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
            {suspectImg && (
              <img src={suspectImg} className={styles.suspectImage} />
            )}
            <button
              className={styles.actionButton}
              onClick={activateExtractSuspect}
            >
              Track new suspect
            </button>
          </div>

          <div className={styles.box}>
            <h3 className={styles.boxTitle}>Detections</h3>
            <ListDetections detections={selectedCamera.detections} />
          </div>
        </div>

        <div className={styles.player}>
          {websocket.analysing ? (
            <h1 style={{ color: "white" }}>Video is being analysed...</h1>
          ) : (
            <></>
          )}
          <Player
            videoAnalysis={selectedCamera}
            controls={true}
            extractingSuspect={extractingSuspect}
            requestReanalysis={requestNewReanalysis}
          />
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
