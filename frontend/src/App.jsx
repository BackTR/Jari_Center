import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

import Login from './pages/Login/Login.jsx'
import PetugasDashboard from './pages/Petugas/PetugasDashboard.jsx'
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard.jsx'
import PatientRegister from './pages/PatientRegister/PatientRegister.jsx'
import PatientIdentify from './pages/PatientIdentify/PatientIdentify.jsx'
import VisitRegister from './pages/VisitRegister/VisitRegister.jsx'
import VisitDetail from './pages/VisitDetail/VisitDetail.jsx'
import KunjunganPage from './pages/Kunjungan/KunjunganPage.jsx'
import AntrianPage from './pages/Antrian/AntrianPage.jsx'

function RoleBasedDashboard() {
  const { user } = useAuth()

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />
  }

  return <PetugasDashboard />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<RoleBasedDashboard />} />
        <Route path="/pasien/cari" element={<PatientIdentify />} />
        <Route path="/pasien/baru" element={<PatientRegister />} />
        <Route path="/kunjungan" element={<KunjunganPage />} />
        <Route path="/antrian" element={<AntrianPage />} />
        <Route path="/kunjungan/baru" element={<VisitRegister />} />
        <Route path="/kunjungan/:id" element={<VisitDetail />} />
      </Route>
    </Routes>
  )
}