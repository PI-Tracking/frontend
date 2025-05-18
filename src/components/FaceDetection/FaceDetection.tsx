import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
// import { detectFaceInVideo } from "../../api/faceDetection";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FaceDetection: React.FC = () => {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleReferenceImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleProcess = async () => {
    if (!referenceImage || !videoFile) {
      toast.error("Please select both a reference image and a video file");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("referenceImage", referenceImage);
    formData.append("video", videoFile);

    try {
      const response = await fetch("/api/face-detection", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process video");
      }

      const result = await response.json();

      if (result.faceDetected) {
        toast.success("Face detected in the video!");
      } else {
        toast.warning("No matching face found in the video");
      }
    } catch (error) {
      toast.error("Error processing video: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Face Detection
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reference Image
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload Reference Image
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleReferenceImageChange}
          />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <img
              src={previewUrl}
              alt="Reference"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Video File
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload Video
          <VisuallyHiddenInput
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </Button>
        {videoFile && (
          <Typography variant="body2" color="text.secondary">
            Selected: {videoFile.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleProcess}
        disabled={isProcessing || !referenceImage || !videoFile}
        sx={{ mt: 2 }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Processing...
          </>
        ) : (
          "Process Video"
        )}
      </Button>
    </Box>
  );
};

export default FaceDetection;
