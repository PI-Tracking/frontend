import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import TestPage from "./pages/test/TestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/test" element={<TestPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
