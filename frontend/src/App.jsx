import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";
import Reports from "./pages/Reports";
import AuthorityReview from "./pages/AuthorityReview";
import MapView from "./pages/MapView";
import ProtectedRoute from "./components/ProtectedRoute";
import Alerts from "./pages/Alerts";
import StationHistory from "./pages/StationHistory";
import NGODashboard from "./pages/NGODashboard";
import PredictiveAlerts from "./pages/PredictiveAlerts";
import NGOProjects from "./pages/NGOProjects";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/submit" element={
          <ProtectedRoute>
            <SubmitReport />
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        
        <Route path="/review" element={
          <ProtectedRoute>
            <AuthorityReview />
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        } />
        
        <Route path="/alerts" element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <StationHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/ngo-dashboard" element={
          <ProtectedRoute>
            <NGODashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/predictive-alerts" element={
          <ProtectedRoute>
            <PredictiveAlerts />
          </ProtectedRoute>
        } />
        
        <Route path="/ngo-projects" element={
          <ProtectedRoute>
            <NGOProjects />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;