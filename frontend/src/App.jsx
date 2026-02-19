import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MapFullPage from "./pages/MapFullPage";
import Reports from "./pages/Reports";
import ReportForm from "./pages/ReportForm";
import NGODashboard from "./pages/NGODashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MapFullPage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Reports />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ReportForm />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo"
          element={
            <ProtectedRoute roles={["ngo"]}>
              <>
                <Navbar />
                <NGODashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute roles={["admin"]}>
              <>
                <Navbar />
                <Register />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;