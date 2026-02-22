import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
