import "./VideoViewer.css";

type Props = {
  frame: string;
};

function VideoViewer({ frame }: Props) {
  return (
    <div className="container">
      <img
        className="camera-view"
        src={`data:image/jpeg;base64,${frame}`}
        alt="Video Frame"
      />
    </div>
  );
}

export default VideoViewer;
