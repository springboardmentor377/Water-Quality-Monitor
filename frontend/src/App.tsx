import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import MapView from "./components/MapView";
import CreateReport from "./components/CreateReport";
import Report from "./components/Report";
import Alert from "./components/Alert";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Main Layout */}
        <Route path="/dashboard" element={<MainPage />}>

          <Route index element={<Navigate to="map" replace />} />
          <Route path="map" element={<MapView />} />
          <Route path="create-report" element={<CreateReport />} />
          <Route path="reports" element={<Report />} />
          <Route path="alert" element={<Alert />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
