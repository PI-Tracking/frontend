import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminManagePage from "./pages/Admin/AdminManagePage";
import AdminCameraPage from "./pages/Admin/AdminCameraPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/" element={<MainPage />} /> */}
        {/* <Route path="/" element={<AdminManagePage />} />  { /* path = admin/manage */ } */} 
        <Route path="/" element={<AdminCameraPage />} />
      </Routes>
    </Router>
  );
}

export default App;
