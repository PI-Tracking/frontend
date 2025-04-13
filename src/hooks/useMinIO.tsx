import axios, { AxiosError } from "axios";
import { useState } from "react";
//import * as Minio from "minio";

export function useMinIO() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState("");

  const uploadFile = async (file: File, url: string) => {
    setUploading(true);

    try {
      const response = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(progressEvent.loaded / progressEvent.total);
          } else {
            setProgress(0);
          }
        },
      });
      console.log(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        setProgress(-1);
        setError(error.message);
      }
    }
  };

  return {
    uploadFile,
    uploading,
    progress,
    error,
  };
}
