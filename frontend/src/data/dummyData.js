export const patients = [
  {
    id: "P001",
    name: "Ahmad Fauzan",
    gender: "Laki-laki",
    age: 35,
    phone: "081234567890",
    address: "Bekasi",
  },
  {
    id: "P002",
    name: "Siti Rahma",
    gender: "Perempuan",
    age: 29,
    phone: "081298765432",
    address: "Jakarta Timur",
  },
  {
    id: "P003",
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: 42,
    phone: "082112345678",
    address: "Bekasi",
  },
];

export const examinations = [
  {
    id: "E001",
    patientId: "P001",
    patientName: "Ahmad Fauzan",
    date: "2026-09-10",
    type: "Pemeriksaan Umum",
    result: "Normal",
    doctor: "dr. Andi",
  },
  {
    id: "E002",
    patientId: "P002",
    patientName: "Siti Rahma",
    date: "2026-09-10",
    type: "Pemeriksaan Jari",
    result: "Perlu Pemeriksaan Lanjutan",
    doctor: "dr. Andi",
  },
];

export const schedules = [
  {
    id: "J001",
    patientName: "Ahmad Fauzan",
    date: "2026-09-11",
    time: "09:00",
    type: "Pemeriksaan Umum",
    status: "Terjadwal",
  },
  {
    id: "J002",
    patientName: "Siti Rahma",
    date: "2026-09-11",
    time: "10:30",
    type: "Pemeriksaan Jari",
    status: "Terjadwal",
  },
];