import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { extractErrorMessage } from '../../utils/errors.js'
import StatCard from '../../components/StatCard/StatCard.jsx'
import DataTable from '../../components/DataTable/DataTable.jsx'
import api from '../../api/axios'
import { Icon } from '../../components/icons.jsx'
import './SuperAdminDashboard.css'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [facilities, setFacilities] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [panel, setPanel] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setError('')

      const [statsRes, facilitiesRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/facilities'),
        api.get('/admin/users'),
      ])

      setStats(statsRes.data?.data ?? null)
      setFacilities(facilitiesRes.data?.data ?? [])
      setUsers(usersRes.data?.data ?? [])
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openPanel = (kind, row) => {
    setNotice('')
    setForm(
      kind === 'facility'
        ? { type: 'clinic', ...(row ?? {}) }
        : { role: 'petugas_registrasi', is_active: true, ...(row ?? {}) },
    )
    setPanel({ kind, row })
  }

  const submitPanel = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const isFacility = panel.kind === 'facility'
    const isEdit = Boolean(panel.row)

    const payload = { ...form }

    // Select kosong kirim "", yang gagal jadi integer di kolom FK.
    if (!payload.facility_id) delete payload.facility_id

    if (isEdit) {
      delete payload.id
      delete payload.users_count
      delete payload.visits_count
      delete payload.created_at
      delete payload.facility_name
    }

    try {
      const { data } = await api({
        method: isEdit ? 'put' : 'post',
        url: isFacility
          ? `/admin/facilities${isEdit ? `/${panel.row.id}` : ''}`
          : `/admin/users${isEdit ? `/${panel.row.id}` : ''}`,
        data: payload,
      })

      setNotice(data.message)
      setPanel(null)
      await loadData()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const resetPassword = async (row) => {
    const password = window.prompt(`Password baru untuk ${row.name} (min. 8 karakter):`)
    if (!password) return

    try {
      const { data } = await api.patch(`/admin/users/${row.id}/reset-password`, { password })
      setNotice(data.message)
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const facilityColumns = [
    { key: 'name', label: 'Nama Faskes' },
    { key: 'type', label: 'Tipe', render: (row) => row.type },
    { key: 'code', label: 'Kode' },
    { key: 'users_count', label: 'User' },
    { key: 'visits_count', label: 'Kunjungan' },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ]

  const userColumns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => row.role },
    { key: 'facility_name', label: 'Faskes' },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ]

  const facilityActions = [
    { label: 'Edit', onClick: (row) => openPanel('facility', row) },
  ]

  const userActions = [
    { label: 'Edit', onClick: (row) => openPanel('user', row) },
    { label: 'Reset Password', type: 'secondary', onClick: resetPassword },
  ]

  if (loading) {
    return (
      <div className="superadmin-page">
        <div className="superadmin-loading">
          <div className="superadmin-loading-spinner" />
          <strong>Memuat data...</strong>
        </div>
      </div>
    )
  }

  if (error && !panel) {
    return (
      <div className="superadmin-page">
        <div className="superadmin-error">
          <strong>Error</strong>
          <p>{error}</p>
          <button onClick={loadData}>Coba Lagi</button>
        </div>
      </div>
    )
  }

  const isFacilityPanel = panel?.kind === 'facility'
  const field = (key) => ({
    value: form[key] ?? '',
    onChange: (e) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      })),
  })

  return (
    <div className="superadmin-page">
      <div className="superadmin-header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>Monitoring dan manajemen sistem Jari Center</p>
        </div>
      </div>

      {notice && <div className="superadmin-notice">{notice}</div>}
      {error && panel && <div className="superadmin-error superadmin-error--inline">{error}</div>}

      {stats && (
        <div className="superadmin-stats">
          <StatCard
            icon={<Icon name="users" />}
            label="Total Pasien"
            value={stats.total_patients}
            color="blue"
          />
          <StatCard
            icon={<Icon name="calendar" />}
            label="Kunjungan Hari Ini"
            value={stats.total_visits_today}
            color="green"
          />
          <StatCard
            icon={<Icon name="hospital" />}
            label="Faskes Aktif"
            value={stats.total_facilities}
            color="orange"
          />
          <StatCard
            icon={<Icon name="activity" />}
            label="User Aktif"
            value={stats.total_users}
            color="purple"
          />
        </div>
      )}

      <div className="superadmin-grid">
        <div className="superadmin-card">
          <div className="superadmin-card-header">
            <h2>Daftar Faskes</h2>
            <button
              className="superadmin-btn superadmin-btn--primary"
              onClick={() => openPanel('facility')}
            >
              Tambah Faskes
            </button>
          </div>
          <DataTable
            columns={facilityColumns}
            data={facilities}
            actions={facilityActions}
          />
        </div>

        <div className="superadmin-card">
          <div className="superadmin-card-header">
            <h2>Daftar User</h2>
            <button
              className="superadmin-btn superadmin-btn--primary"
              onClick={() => openPanel('user')}
            >
              Tambah User
            </button>
          </div>
          <DataTable columns={userColumns} data={users} actions={userActions} />
        </div>
      </div>

      {panel && (
        <div className="superadmin-modal-backdrop">
          <form className="superadmin-modal" onSubmit={submitPanel}>
            <h2>
              {isFacilityPanel ? 'Faskes' : 'User'}{' '}
              {panel.row ? '— Edit' : '— Tambah'}
            </h2>

            {isFacilityPanel ? (
              <>
                <label>Nama<input required {...field('name')} /></label>
                <label>
                  Tipe
                  <select {...field('type')}>
                    {['hospital', 'clinic', 'puskesmas'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>Kode<input required {...field('code')} /></label>
                <label>Alamat<input {...field('address')} /></label>
                <label>Telepon<input {...field('phone')} /></label>
                <label className="superadmin-checkbox">
                  <input type="checkbox" {...field('is_active')} /> Aktif
                </label>
              </>
            ) : (
              <>
                <label>Nama<input required {...field('name')} /></label>
                <label>Email<input type="email" required {...field('email')} /></label>
                {!panel.row && (
                  <label>
                    Password
                    <input type="password" required minLength={8} {...field('password')} />
                  </label>
                )}
                <label>
                  Role
                  <select {...field('role')}>
                    {['super_admin', 'facility_admin', 'petugas_registrasi', 'dokter'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Faskes
                  <select {...field('facility_id')}>
                    <option value="">— Tidak ada —</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </label>
                <label className="superadmin-checkbox">
                  <input type="checkbox" {...field('is_active')} /> Aktif
                </label>
              </>
            )}

            <div className="superadmin-modal-actions">
              <button
                type="button"
                className="superadmin-btn superadmin-btn--ghost"
                onClick={() => setPanel(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="superadmin-btn superadmin-btn--primary"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
