import { Outlet } from "react-router-dom"; // <-- ini kurang
import Header from "../components/Header/Header";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;