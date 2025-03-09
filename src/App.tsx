import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import TestPage from "./pages/test/TestPage";
import UploadVideosPage from "./pages/upload_videos/UploadVideosPage";
import CamerasPage from "./pages/cameras_page_1/CamerasPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/test" element={<TestPage />} /> */}
        {/* <Route path="/" element={<UploadVideosPage />} /> */}
        <Route path="/" element={<CamerasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
