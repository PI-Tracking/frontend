import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Main */
import MainPage from "@pages/Main";
import LoginPage from "@pages/Login";
/* User */
import UploadVideosPage from "@pages/UploadVideos";
import ReportsPage from "@pages/Reports";
import CamerasPage from "@pages/Cameras";
/* Admin */
import AdminCameraPage from "@pages/admin/ManageCameras";
import AdminManageUsers from "@pages/admin/ManageUsers";
import AdminLogs from "@pages/admin/Logs";


import CamerasPageMap from "@pages/Cameras2";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/upload-videos" element={<UploadVideosPage />} />
        <Route path="/cameras" element={<CamerasPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        <Route path="/admin/cameras" element={<AdminCameraPage />} />
        <Route path="/admin/users" element={<AdminManageUsers />} /> */}
        <Route path="/" element={<CamerasPageMap />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Routes>
    </Router>
  );
}

export default App;
