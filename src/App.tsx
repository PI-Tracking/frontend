import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

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
import AdminLogs from "@pages/admin/Logs";

import CamerasPageMap from "@pages/Cameras2";
import ResetPasswordPage from "@pages/Reset password";
import { ReactNode } from "react";
import { useAuth } from "@hooks/useAuth";
import { IAuthContext } from "@context/IAuthContext";
import { AuthProvider } from "@context/AuthProvider";
import { ErrorPage } from "@pages/ErrorPage";

function RequireAuth({
  children,
  admin,
}: {
  children: ReactNode;
  admin: boolean | undefined;
}) {
  const auth: IAuthContext = useAuth();

  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  if (admin && !auth.isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />

          <RequireAuth admin={false}>
            {/* <Route path="/cameras" element={<CamerasPage />} /> */}
            <Route path="/cameras" element={<CamerasPageMap />} />
            <Route path="/upload-videos" element={<UploadVideosPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </RequireAuth>

          <RequireAuth admin={true}>
            <Route path="/admin/cameras" element={<AdminCameraPage />} />
            <Route path="/admin/users" element={<AdminManageUsers />} />
            <Route path="/admin/users" element={<AdminManageUsers />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </RequireAuth>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
