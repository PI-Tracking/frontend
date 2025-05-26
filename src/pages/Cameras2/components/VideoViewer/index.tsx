import "./VideoViewer.css";

type Props = {
  frame: string;
};

function VideoViewer({ frame }: Props) {
  return (
    <img
      className="camera-view"
      src={`data:image/jpeg;base64,${frame}`}
      alt="Video Frame"
    />
  );
}

export default VideoViewer;
