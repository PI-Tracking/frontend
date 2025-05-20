import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { IAuthContext } from "@context/IAuthContext";
import { AuthProvider } from "@context/AuthProvider";
import { ErrorPage } from "@pages/ErrorPage";

/* Admin */
import AdminCameraPage from "@pages/admin/ManageCameras";
import AdminManageUsers from "@pages/admin/ManageUsers";
import AdminLogs from "@pages/admin/Logs";

/* Main */
import MainPage from "@pages/Main";
import LoginPage from "@pages/Login";

/* User */
import ReportsPage from "@pages/Reports";
import UploadVideosPage from "@pages/UploadVideos";
import VideoAnalysisPage from "@pages/VideoAnalysis";
import CamerasPageMap from "@pages/Cameras2";
import ResetPasswordPage from "@pages/Reset password";
import MapTrackingPage from "@pages/MapTrack/MapTrackingPage";

function RequireAuth({ admin }: { admin: boolean }) {
  const auth: IAuthContext = useAuth();

  if (auth.loading) {
    return;
  }

  if (!auth.user) {
    return <Navigate to="/not-found" replace />;
  }

  if (admin && !auth.isAdmin()) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}

import ProfilePage from "@pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* GENERALLY ACCESSIBLE PAGES */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* USERS PAGES */}
          <Route element={<RequireAuth admin={false} />}>
            <Route path="/cameras" element={<CamerasPageMap />} />
            <Route path="/upload-videos" element={<UploadVideosPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/report/:id" element={<VideoAnalysisPage />} />
            <Route path="/map-tracking" element={<MapTrackingPage />} />
          </Route>

          {/* ADMINS PAGES*/}
          <Route path="/admin" element={<RequireAuth admin={true} />}>
            <Route path="cameras" element={<AdminCameraPage />} />
            <Route path="users" element={<AdminManageUsers />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>

          {/* FALLBACK PAGES */}
          <Route path="/not-found" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
