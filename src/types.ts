export interface Pustu {
  id: string;
  label: string;
  kelurahan: string;
  targetPerSesi: number;
}

export interface Session {
  id: string;
  label: string;
  tanggal: string; // YYYY-MM-DD
  topik?: string;
}

export type AttendanceStatus = 'hadir' | 'tidak' | 'izin' | 'sakit' | null;

export interface AttendanceRecord {
  status: AttendanceStatus;
  alasan?: string;
  catatan?: string;
  updatedAt?: string;
}

export interface Patient {
  id: number;
  nama: string;
  suami?: string;
  pustu: string;
  tglLahir: string; // YYYY-MM-DD
  alamat: string;
  hp: string;
  gravida: number;
  paritas: number;
  abortus: number;
  hpht: string; // YYYY-MM-DD
  tinggiBadan?: number | null; // cm
  beratBadan?: number | null; // kg
  lila?: number | null; // Lingkar Lengan Atas (cm)
  jarakKehamilan?: number | null; // tahun
  
  // Riwayat Penyakit & Kondisi Khusus
  hipertensi?: boolean;
  diabetes?: boolean;
  jantung?: boolean;
  anemia?: boolean;
  tindakanPersalinan?: boolean; // Riwayat SC / vakum / forsep
  perdarahanPersalinan?: boolean;
  kembar?: boolean; // Gemelli
  sungsangLintang?: boolean; // Malpresentasi
  preeklamsia?: boolean;
  lainLain?: string;
  
  // Catatan Bidan
  catatanBidan?: string;
  
  // Rekam Kehadiran per Sesi ID
  attendance: Record<string, AttendanceRecord>;
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'usia' | 'obstetri' | 'antropometri' | 'penyakit' | 'posisi';
  severity: 'warning' | 'danger';
}
