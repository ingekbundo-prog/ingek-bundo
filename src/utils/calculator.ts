import { Patient, RiskItem } from '../types';

export function calcAge(tglLahir: string): number {
  if (!tglLahir) return 0;
  const d = new Date(tglLahir);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function calcUsiaKehamilan(hpht: string): { weeks: number; days: number; text: string; trimester: number } {
  if (!hpht) return { weeks: 0, days: 0, text: '0 minggu', trimester: 1 };
  const d = new Date(hpht);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - d.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  
  let trimester = 1;
  if (weeks >= 28) trimester = 3;
  else if (weeks >= 14) trimester = 2;

  const text = days > 0 ? `${weeks} mgg ${days} hr` : `${weeks} minggu`;
  return { weeks, days, text, trimester };
}

export function calcHPL(hpht: string): Date | null {
  if (!hpht) return null;
  const d = new Date(hpht);
  if (isNaN(d.getTime())) return null;
  // Rumus Naegele: HPHT + 7 hari, + 9 bulan (atau - 3 bulan + 1 tahun)
  const result = new Date(d);
  result.setDate(result.getDate() + 7);
  result.setMonth(result.getMonth() + 9);
  return result;
}

export function calcDaysToHpl(hpht: string): number | null {
  const hpl = calcHPL(hpht);
  if (!hpl) return null;
  const now = new Date();
  const diffTime = hpl.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calcBMI(tinggiCm?: number | null, beratKg?: number | null): number | null {
  if (!tinggiCm || !beratKg || tinggiCm <= 0 || beratKg <= 0) return null;
  const m = tinggiCm / 100;
  return +(beratKg / (m * m)).toFixed(1);
}

export function getBmiStatus(bmi: number | null): { label: string; color: string; isRisk: boolean } {
  if (bmi === null) return { label: '-', color: 'text-gray-400', isRisk: false };
  if (bmi < 18.5) return { label: 'Kurus (Risiko KEK)', color: 'text-rose-600 font-semibold', isRisk: true };
  if (bmi < 25) return { label: 'Normal', color: 'text-emerald-700 font-medium', isRisk: false };
  if (bmi < 27) return { label: 'Kelebihan BB', color: 'text-amber-600 font-medium', isRisk: false };
  return { label: 'Obesitas (Risiko Tinggi)', color: 'text-rose-600 font-semibold', isRisk: true };
}

export function getLilaStatus(lila?: number | null): { label: string; isRisk: boolean } {
  if (!lila) return { label: '-', isRisk: false };
  if (lila < 23.5) return { label: `${lila} cm (Risiko KEK)`, isRisk: true };
  return { label: `${lila} cm (Normal)`, isRisk: false };
}

export function getRiskAnalysis(pt: Patient): RiskItem[] {
  const age = calcAge(pt.tglLahir);
  const items: RiskItem[] = [];

  if (age > 0 && age < 20) {
    items.push({
      id: 'usia-muda',
      title: 'Usia Terlalu Muda (< 20 tahun)',
      category: 'usia',
      severity: 'danger',
    });
  } else if (age > 35) {
    items.push({
      id: 'usia-tua',
      title: 'Usia Terlalu Tua (> 35 tahun)',
      category: 'usia',
      severity: 'warning',
    });
  }

  if (pt.gravida >= 4) {
    items.push({
      id: 'grande-multipara',
      title: `Kehamilan ke-${pt.gravida} (Grande Multipara)`,
      category: 'obstetri',
      severity: 'warning',
    });
  }

  if (pt.abortus >= 1) {
    items.push({
      id: 'riwayat-keguguran',
      title: `Riwayat Keguguran (${pt.abortus}x)`,
      category: 'obstetri',
      severity: 'danger',
    });
  }

  if (pt.jarakKehamilan !== null && pt.jarakKehamilan !== undefined && pt.paritas > 0 && pt.jarakKehamilan < 2) {
    items.push({
      id: 'jarak-dekat',
      title: `Jarak Anak Terakhir Terlalu Dekat (${pt.jarakKehamilan} th)`,
      category: 'obstetri',
      severity: 'warning',
    });
  }

  if (pt.tinggiBadan && pt.tinggiBadan < 145) {
    items.push({
      id: 'tb-pendek',
      title: `Tinggi Badan < 145 cm (${pt.tinggiBadan} cm, Risiko Panggul Sempit)`,
      category: 'antropometri',
      severity: 'danger',
    });
  }

  const bmi = calcBMI(pt.tinggiBadan, pt.beratBadan);
  if (bmi !== null) {
    if (bmi < 18.5) {
      items.push({
        id: 'bmi-kek',
        title: `IMT Kurang (${bmi}, Risiko Ibu Hamil KEK)`,
        category: 'antropometri',
        severity: 'danger',
      });
    } else if (bmi >= 27) {
      items.push({
        id: 'bmi-obesitas',
        title: `IMT Obesitas (${bmi}, Risiko Preeklamsia & GDM)`,
        category: 'antropometri',
        severity: 'warning',
      });
    }
  }

  if (pt.lila && pt.lila < 23.5) {
    items.push({
      id: 'lila-kek',
      title: `LILA < 23.5 cm (${pt.lila} cm, Kurang Energi Kronis)`,
      category: 'antropometri',
      severity: 'danger',
    });
  }

  if (pt.hipertensi) {
    items.push({
      id: 'hipertensi',
      title: 'Riwayat Hipertensi Kronis',
      category: 'penyakit',
      severity: 'danger',
    });
  }

  if (pt.diabetes) {
    items.push({
      id: 'diabetes',
      title: 'Riwayat Diabetes Melitus',
      category: 'penyakit',
      severity: 'danger',
    });
  }

  if (pt.jantung) {
    items.push({
      id: 'jantung',
      title: 'Riwayat Penyakit Jantung',
      category: 'penyakit',
      severity: 'danger',
    });
  }

  if (pt.anemia) {
    items.push({
      id: 'anemia',
      title: 'Riwayat Anemia dalam Kehamilan',
      category: 'penyakit',
      severity: 'warning',
    });
  }

  if (pt.preeklamsia) {
    items.push({
      id: 'preeklamsia',
      title: 'Riwayat / Gejala Preeklamsia-Eklamsia',
      category: 'penyakit',
      severity: 'danger',
    });
  }

  if (pt.tindakanPersalinan) {
    items.push({
      id: 'tindakan',
      title: 'Riwayat Persalinan Tindakan (Sesar / Vakum / Forsep)',
      category: 'obstetri',
      severity: 'warning',
    });
  }

  if (pt.perdarahanPersalinan) {
    items.push({
      id: 'perdarahan',
      title: 'Riwayat Perdarahan Pascasalin Sebelumnya',
      category: 'obstetri',
      severity: 'danger',
    });
  }

  if (pt.kembar) {
    items.push({
      id: 'kembar',
      title: 'Kehamilan Ganda / Kembar (Gemelli)',
      category: 'posisi',
      severity: 'danger',
    });
  }

  if (pt.sungsangLintang) {
    items.push({
      id: 'sungsang',
      title: 'Kelainan Letak Janin (Sungsang / Lintang)',
      category: 'posisi',
      severity: 'warning',
    });
  }

  if (pt.lainLain && pt.lainLain.trim().length > 0) {
    items.push({
      id: 'lain-lain',
      title: `Kondisi Penyerta: ${pt.lainLain.trim()}`,
      category: 'penyakit',
      severity: 'warning',
    });
  }

  return items;
}

export function calcTotalHadir(pt: Patient): number {
  if (!pt.attendance) return 0;
  return Object.values(pt.attendance).reduce((count, record) => {
    return record && typeof record === 'object' && 'status' in record && record.status === 'hadir'
      ? count + 1
      : count;
  }, 0);
}

export function formatDateIndo(dateStr?: string | Date | null): string {
  if (!dateStr) return '-';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
