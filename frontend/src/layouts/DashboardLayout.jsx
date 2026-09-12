import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main><Outlet /></main>
      </div>
    </div>
  );
}

export default DashboardLayout; 