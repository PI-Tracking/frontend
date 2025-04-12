import axios from "axios";
import { useState } from "react";
//import * as Minio from "minio";

export function useMinIO() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = async (file: File, url: string) => {
    setUploading(true);

    return axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          Math.round(
            // idk I didnt wrote this chatgipity did
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          )
        );
      },
    });
  };

  return {
    uploadFile,
    uploading,
    progress,
  };
}
