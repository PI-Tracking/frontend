import { Detection } from "@Types/Detection";

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
