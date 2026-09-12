import { Patient, Session } from '../types';
import {
  calcAge,
  calcUsiaKehamilan,
  calcHPL,
  calcBMI,
  getBmiStatus,
  getRiskAnalysis,
  formatDateIndo,
} from './calculator';

export function exportToCsv(patients: Patient[], sessions: Session[], pustuLabel: string) {
  const headers = [
    'No',
    'Nama Ibu',
    'Nama Suami',
    'Usia (Th)',
    'Nomor HP',
    'Alamat',
    'Gravida (G)',
    'Paritas (P)',
    'Abortus (A)',
    'HPHT',
    'HPL (Taksiran Lahir)',
    'Usia Kehamilan',
    'TB (cm)',
    'BB (kg)',
    'IMT',
    'Status Gizi',
    'LILA (cm)',
    'Status Risiko',
    'Faktor Risiko Terdeteksi',
    ...sessions.map((s) => `Presensi ${s.label} (${s.tanggal})`),
    'Catatan Bidan',
  ];

  const rows = patients.map((pt, index) => {
    const age = calcAge(pt.tglLahir);
    const gest = calcUsiaKehamilan(pt.hpht);
    const hpl = calcHPL(pt.hpht);
    const bmi = calcBMI(pt.tinggiBadan, pt.beratBadan);
    const bmiInfo = getBmiStatus(bmi);
    const risks = getRiskAnalysis(pt);
    const isRisk = risks.length > 0;

    const sessionAttendance = sessions.map((s) => {
      const att = pt.attendance[s.id];
      if (!att || !att.status) return 'Belum Dicatat';
      if (att.status === 'hadir') return 'Hadir';
      return `Tidak Hadir (${att.alasan || 'Tanpa keterangan'})`;
    });

    return [
      index + 1,
      `"${pt.nama.replace(/"/g, '""')}"`,
      `"${(pt.suami || '-').replace(/"/g, '""')}"`,
      age,
      `'${pt.hp || '-'}`,
      `"${pt.alamat.replace(/"/g, '""')}"`,
      pt.gravida,
      pt.paritas,
      pt.abortus,
      pt.hpht,
      formatDateIndo(hpl),
      gest.text,
      pt.tinggiBadan || '-',
      pt.beratBadan || '-',
      bmi || '-',
      bmiInfo.label,
      pt.lila || '-',
      isRisk ? 'RISIKO TINGGI' : 'Risiko Rendah',
      `"${risks.map((r) => r.title).join('; ')}"`,
      ...sessionAttendance.map((a) => `"${a}"`),
      `"${(pt.catatanBidan || '-').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `Rekap_Kelas_Ibu_Hamil_${pustuLabel.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
