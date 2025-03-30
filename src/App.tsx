import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Admin */
import AdminCameraPage from "@pages/admin/ManageCameras";
import AdminManageUsers from "@pages/admin/ManageUsers";
/* Main */
import MainPage from "@pages/Main";
import LoginPage from "@pages/Login";
/* User */
import UploadVideosPage from "@pages/UploadVideos";
import ReportsPage from "@pages/Reports";
// import CamerasPage from "@pages/Cameras";
/* Admin */
import AdminCameraPage from "@pages/admin/ManageCameras";
import AdminManageUsers from "@pages/admin/ManageUsers";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/cameras" element={<CamerasPage />} /> */}
        <Route path="/cameras" element={<CamerasPageMap />} />
        {/* These two */}

        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/upload-videos" element={<UploadVideosPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/report/:id" element={<VideoAnalysisPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* For admin  */}
        <Route path="/admin/cameras" element={<AdminCameraPage />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Routes>
    </Router>
  );
}

export default App;
