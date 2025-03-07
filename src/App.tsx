import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminManagePage from "./pages/Admin/AdminManagePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/" element={<MainPage />} /> */}
        <Route path="/" element={<AdminManagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
