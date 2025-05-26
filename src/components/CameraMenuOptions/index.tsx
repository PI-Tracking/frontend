import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DocumentIcon,
  MapIcon,
  CameraIcon,
  ArrowUpTrayIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import "./cameraMenuOptions.css";

type MenuOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

function CameraMenuOptions() {
  const [selectedOption, setSelectedOption] = useState<string>("camera");
  const navigate = useNavigate();
  const location = useLocation();

  const menuOptions: MenuOption[] = [
    { id: "document", icon: <DocumentIcon />, label: "Document" },
    { id: "map", icon: <MapIcon />, label: "Map" },
    { id: "camera", icon: <CameraIcon />, label: "Camera" },
    { id: "share", icon: <ArrowUpTrayIcon />, label: "Share" },
    { id: "video", icon: <VideoCameraIcon />, label: "Video" },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/reports":
        setSelectedOption("document");
        break;
      case "/cameras":
        setSelectedOption("camera");
        break;
      case "/upload-videos":
        setSelectedOption("share");
        break;
      case location.pathname.startsWith("/report/") ? location.pathname : "":
        setSelectedOption("video");
        break;
      case "/map-tracking":
        setSelectedOption("map");
        break;
      default:
        break;
    }
  }, [location]);

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
    switch (id) {
      case "document":
        navigate("/reports");
        break;
      case "map":
        navigate("/map-tracking");
        break;
      case "camera":
        navigate("/cameras");
        break;
      case "share":
        navigate("/upload-videos");
        break;
      case "video":
        break;
      default:
        break;
    }
  };

  return (
    <div className="camera-menu-options">
      {menuOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => handleOptionClick(option.id)}
          className={`menu-option ${selectedOption === option.id ? "selected" : ""}`}
          aria-label={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

export default CameraMenuOptions;
