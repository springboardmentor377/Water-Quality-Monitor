import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import MapView from "./components/MapView";
import CreateReport from "./components/CreateReport";
import Report from "./components/Report";
import Dashboard from "./components/Dashboard";
import AlertManagement from "./components/AlertManagement";
import NGOCollaboration from "./components/NGOCollaboration";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Redirect /login to root */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard page */}
          <Route index element={<Dashboard />} />

          {/* Dashboard sub-routes */}
          <Route path="map" element={<MapView />} />
          <Route path="create-report" element={<CreateReport />} />
          <Route path="reports" element={<Report />} />
          <Route path="alerts" element={<AlertManagement />} />
          <Route path="ngo-collaboration" element={<NGOCollaboration />} />
          
          {/* Catch-all for unknown dashboard routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all for unknown routes - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
