import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Auth from "./pages/auth";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MapFullPage from "./pages/MapFullPage";
=======
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
>>>>>>> origin/main
import Reports from "./pages/Reports";
import ReportForm from "./pages/ReportForm";
import NGODashboard from "./pages/NGODashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* Public Route */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}
=======
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Citizen / Common */}
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
        {/* NGO */}
>>>>>>> origin/main
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
<<<<<<< HEAD

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
=======
>>>>>>> origin/main
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/main
