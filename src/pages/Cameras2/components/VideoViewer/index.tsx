import "./VideoViewer.css";

type Props = {
  frame?: string;
  cameraId: string;
};

function VideoViewer({ frame, cameraId }: Props) {
  return (
    <>
      {frame ? (
        <img
          className="camera-view"
          src={`data:image/jpeg;base64,${frame}`}
          alt="Video Frame"
        />
      ) : (
        <div className="camera-view">
          <p>Waiting for frames...</p>
          <p>Camera ID: {cameraId}</p>
        </div>
      )}
    </>
  );
}

export default VideoViewer;
