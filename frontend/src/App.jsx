import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Examinations from "./pages/Examinations";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Login from "./components/Login";

// ✅ BENAR — Header ada di dalam DashboardLayout, Login berdiri sendiri
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          {/* dst */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;