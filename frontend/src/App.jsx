import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import StationDashboard from "./pages/StationDashboard";  
import ProtectedRoute from "./components/ProtectedRoute";
import Alerts from "./pages/Alerts";
import Collaboration from "./pages/Collaboration";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Stations Map Route */}
        <Route
          path="/stations"
          element={
            <ProtectedRoute>
              <StationDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
              path="/alerts"
               element=
              {
                <Alerts />
              }
        />

        <Route 
              path="/collaboration"
              element=
              {
                <Collaboration />
              }
        />

        <Route 
              path="/analytics"
              element=
              {
                <Analytics />
              }
        />
      <Route path="/map" element={<MapView />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
