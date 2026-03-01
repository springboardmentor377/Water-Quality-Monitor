import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
