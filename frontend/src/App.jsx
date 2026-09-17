import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/auth/Login';
import Antrian from './pages/menu-navbar/antrian/Antrian';
import Billing from './pages/menu-navbar/billing/Billing';
import Farmasi from './pages/menu-navbar/farmasi/Farmasi';
import Igd from './pages/menu-navbar/igd/Igd';
import Laboratorium from './pages/menu-navbar/laboratorium/Laboratorium';
import Rekammedis from './pages/menu-navbar/rekammedis/Rekammedis';
import Registrasipasien from './pages/menu-navbar/Registrasi/Resgistrasipasien';
import Pengaturan from './pages/menu-navbar/pengaturan/Pengaturan';
import { isLoggedIn } from './services/api';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />}
        />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registrasi-pasien" element={<Registrasipasien />} />
          <Route path="/rekammedis" element={<Rekammedis />} />
          <Route path="/igd" element={<Igd />} />
          <Route path="/antrian" element={<Antrian />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/laboratorium" element={<Laboratorium />} />
          <Route path="/farmasi" element={<Farmasi />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>

        <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;