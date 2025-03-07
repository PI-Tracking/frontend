import React, { useState } from 'react';
import { DocumentIcon, MapIcon, CameraIcon, ArrowUpTrayIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import './CameraMenuOptions.css';

type MenuOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

function CameraMenuOptions() {
  const [selectedOption, setSelectedOption] = useState<string>('camera');

  const menuOptions: MenuOption[] = [
    { id: 'document', icon: <DocumentIcon />, label: 'Document' },
    { id: 'map', icon: <MapIcon />, label: 'Map' },
    { id: 'camera', icon: <CameraIcon />, label: 'Camera' },
    { id: 'share', icon: <ArrowUpTrayIcon />, label: 'Share' },
    { id: 'video', icon: <VideoCameraIcon />, label: 'Video' }
  ];

  const handleOptionClick = (id: string) => {
    console.log('Option clicked:', id); // for debuggin purposes but then i found out it was cuz of zindex i couldnt select it
    setSelectedOption(id);
  };

  return (
    <div className="camera-menu-options">
      {menuOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => handleOptionClick(option.id)}
          className={`menu-option ${selectedOption === option.id ? 'selected' : ''}`}
          aria-label={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

export default CameraMenuOptions;