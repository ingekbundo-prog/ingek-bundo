import { Patient, Pustu, Session } from '../types';

export const getTodayDateStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_PUSTU: Pustu[] = [
  {
    id: 'korong-gadang',
    label: 'Pustu Korong Gadang',
    kelurahan: 'Kelurahan Korong Gadang, Kuranji',
    targetPerSesi: 15,
  },
  {
    id: 'kalumbuk',
    label: 'Pustu Kalumbuk',
    kelurahan: 'Kelurahan Kalumbuk, Kuranji',
    targetPerSesi: 15,
  },
];

export const OFFICIAL_SESSION_TOPICS = [
  'Perawatan dan Pemantauan Kehamilan Agar Ibu dan Janin Sehat',
  'Persalinan Aman, Nifas Nyaman, Ibu Selamat, Bayi Sehat',
  'Pencegahan Penyakit dan Komplikasi Kehamilan, Persalinan dan Nifas Agar Ibu dan Bayi Sehat',
  'Perawatan Bayi Baru Lahir Agar Tumbuh Kembang Optimal',
];

export interface SessionGuideStep {
  id: number;
  title: string;
  subtitle: string;
  steps: string[];
  catatanKhusus?: string;
}

export const OFFICIAL_SESSION_STEPS: Record<number, SessionGuideStep> = {
  1: {
    id: 1,
    title: 'Pertemuan I',
    subtitle: 'Perawatan dan Pemantauan Kehamilan Agar Ibu dan Janin Sehat',
    steps: [
      'Pembukaan oleh Pejabat Desa atau Bidan.',
      'Menginformasikan kesepakatan kelompok.',
      'Perkenalan diri.',
      'Informasi umum mengenai mekanisme penyelenggaraan Kelas Ibu Hamil (materi, tujuan, serta manfaat dari Kelas Ibu Hamil).',
      'Pre-Test.',
      'Penyampaian Materi: Perawatan dan Pemantauan Kehamilan Agar Ibu dan Janin Sehat.',
      'Post Test.',
      'Aktivitas Fisik (Senam Hamil).',
      'Demo pengaturan makan bergizi seimbang.',
    ],
  },
  2: {
    id: 2,
    title: 'Pertemuan II',
    subtitle: 'Persalinan Aman, Nifas Nyaman, Ibu Selamat, Bayi Sehat',
    steps: [
      'Review materi pertemuan sebelumnya.',
      'Pre-Test.',
      'Penyampaian materi: Persalinan Aman, Nifas Nyaman, Ibu Selamat, Bayi Sehat.',
      'Post Test.',
      'Aktivitas Fisik (Senam Hamil).',
    ],
  },
  3: {
    id: 3,
    title: 'Pertemuan III',
    subtitle: 'Pencegahan Penyakit dan Komplikasi Kehamilan, Persalinan dan Nifas Agar Ibu dan Bayi Sehat',
    steps: [
      'Review materi pertemuan sebelumnya.',
      'Pre-Test.',
      'Penyampaian materi: Pencegahan Penyakit dan Komplikasi Kehamilan, Persalinan dan Nifas Agar Ibu dan Bayi Sehat.',
      'Post Test.',
      'Aktivitas Fisik (Senam Hamil).',
    ],
  },
  4: {
    id: 4,
    title: 'Pertemuan IV',
    subtitle: 'Perawatan Bayi Baru Lahir Agar Tumbuh Kembang Optimal',
    steps: [
      'Review materi pertemuan sebelumnya.',
      'Pre-Test.',
      'Penyampaian materi: Perawatan Bayi Baru Lahir Agar Tumbuh Kembang Optimal.',
      'Post Test.',
      'Aktivitas Fisik (Senam Hamil).',
      'Demo posisi perlekatan dan menyusui (khusus Pertemuan IV).',
    ],
    catatanKhusus: 'Demo posisi perlekatan dan menyusui dilaksanakan khusus pada Pertemuan IV.',
  },
};

export const createDefaultSessions = (prefix: string): Session[] => {
  const today = getTodayDateStr();
  return [
    {
      id: `${prefix}-s1`,
      label: 'Pertemuan 1',
      tanggal: today,
      topik: OFFICIAL_SESSION_TOPICS[0],
    },
    {
      id: `${prefix}-s2`,
      label: 'Pertemuan 2',
      tanggal: today,
      topik: OFFICIAL_SESSION_TOPICS[1],
    },
    {
      id: `${prefix}-s3`,
      label: 'Pertemuan 3',
      tanggal: today,
      topik: OFFICIAL_SESSION_TOPICS[2],
    },
    {
      id: `${prefix}-s4`,
      label: 'Pertemuan 4',
      tanggal: today,
      topik: OFFICIAL_SESSION_TOPICS[3],
    },
  ];
};

export const INITIAL_SESSIONS: Record<string, Session[]> = {
  'korong-gadang': createDefaultSessions('kg'),
  'kalumbuk': createDefaultSessions('kl'),
};

// Daftar nama ibu hamil (dimulai dari kosong agar siap diisi data riil lapangan)
export const INITIAL_PATIENTS: Patient[] = [];
