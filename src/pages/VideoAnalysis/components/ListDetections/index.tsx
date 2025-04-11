import { Detection } from "../types/Detection";

interface IListDetections {
  detections: Detection[];
}

function ListDetections(props: IListDetections) {
  if (!props.detections) {
    return <></>;
  }

  return <></>;
}

export default ListDetections;
