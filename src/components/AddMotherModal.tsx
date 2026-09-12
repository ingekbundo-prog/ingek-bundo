import React, { useState } from 'react';
import { Patient, Pustu } from '../types';
import {
  calcAge,
  calcHPL,
  calcDaysToHpl,
  calcBMI,
  getBmiStatus,
  formatDateIndo,
} from '../utils/calculator';
import { X, AlertTriangle, Heart, Check, Sparkles, User, Calendar, Activity } from 'lucide-react';

interface AddMotherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePustu: Pustu;
  pustuList?: Pustu[];
  activeSessionId: string;
  onAddPatient: (patientData: Omit<Patient, 'id' | 'attendance'> & { markPresent: boolean }) => void;
}

export const AddMotherModal: React.FC<AddMotherModalProps> = ({
  isOpen,
  onClose,
  activePustu,
  pustuList,
  activeSessionId,
  onAddPatient,
}) => {
  const [selectedPustuId, setSelectedPustuId] = useState<string>(activePustu.id);
  const [nama, setNama] = useState('');
  const [suami, setSuami] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [hp, setHp] = useState('');
  const [alamat, setAlamat] = useState('');

  const [gravida, setGravida] = useState<number>(1);
  const [paritas, setParitas] = useState<number>(0);
  const [abortus, setAbortus] = useState<number>(0);
  const [hpht, setHpht] = useState('');

  const [tinggiBadan, setTinggiBadan] = useState<string>('');
  const [beratBadan, setBeratBadan] = useState<string>('');
  const [lila, setLila] = useState<string>('');
  const [jarakKehamilan, setJarakKehamilan] = useState<string>('');

  // Penyakit
  const [hipertensi, setHipertensi] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [jantung, setJantung] = useState(false);
  const [anemia, setAnemia] = useState(false);
  const [preeklamsia, setPreeklamsia] = useState(false);

  // Obstetri
  const [tindakanPersalinan, setTindakanPersalinan] = useState(false);
  const [perdarahanPersalinan, setPerdarahanPersalinan] = useState(false);
  const [kembar, setKembar] = useState(false);
  const [sungsangLintang, setSungsangLintang] = useState(false);
  const [lainLain, setLainLain] = useState('');

  const [markPresent, setMarkPresent] = useState(true);

  if (!isOpen) return null;

  // Real-time calculations
  const age = tglLahir ? calcAge(tglLahir) : null;
  const hplDate = hpht ? calcHPL(hpht) : null;
  const daysToHpl = hpht ? calcDaysToHpl(hpht) : null;
  const tbNum = tinggiBadan ? Number(tinggiBadan) : null;
  const bbNum = beratBadan ? Number(beratBadan) : null;
  const lilaNum = lila ? Number(lila) : null;
  const bmiVal = calcBMI(tbNum, bbNum);
  const bmiInfo = getBmiStatus(bmiVal);

  // Check detected risks in real-time
  const detectedRisks: string[] = [];
  if (age !== null && age > 0 && age < 20) detectedRisks.push('Usia < 20 tahun');
  if (age !== null && age > 35) detectedRisks.push('Usia > 35 tahun');
  if (gravida >= 4) detectedRisks.push(`Kehamilan ke-${gravida} (Grande Multipara)`);
  if (abortus >= 1) detectedRisks.push(`Riwayat Keguguran (${abortus}x)`);
  if (jarakKehamilan && Number(jarakKehamilan) < 2 && paritas > 0)
    detectedRisks.push(`Jarak anak terakhir < 2 tahun`);
  if (tbNum && tbNum < 145) detectedRisks.push(`Tinggi badan < 145 cm (${tbNum} cm)`);
  if (bmiVal !== null && (bmiVal < 18.5 || bmiVal >= 27))
    detectedRisks.push(`IMT ${bmiVal} (${bmiInfo.label})`);
  if (lilaNum !== null && lilaNum < 23.5)
    detectedRisks.push(`LILA < 23.5 cm (Risiko KEK)`);
  if (hipertensi) detectedRisks.push('Hipertensi');
  if (diabetes) detectedRisks.push('Diabetes');
  if (jantung) detectedRisks.push('Penyakit Jantung');
  if (anemia) detectedRisks.push('Anemia');
  if (preeklamsia) detectedRisks.push('Preeklamsia');
  if (tindakanPersalinan) detectedRisks.push('Riwayat SC/Vakum/Forsep');
  if (perdarahanPersalinan) detectedRisks.push('Riwayat Perdarahan Pascasalin');
  if (kembar) detectedRisks.push('Kehamilan Kembar');
  if (sungsangLintang) detectedRisks.push('Sungsang / Lintang');
  if (lainLain.trim()) detectedRisks.push(`Lainnya: ${lainLain.trim()}`);

  const isRiskDetected = detectedRisks.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !tglLahir || !hpht) return;

    onAddPatient({
      nama: nama.trim(),
      suami: suami.trim() || undefined,
      pustu: selectedPustuId || activePustu.id,
      tglLahir,
      alamat: alamat.trim(),
      hp: hp.trim(),
      gravida: Number(gravida) || 1,
      paritas: Number(paritas) || 0,
      abortus: Number(abortus) || 0,
      hpht,
      tinggiBadan: tbNum,
      beratBadan: bbNum,
      lila: lilaNum,
      jarakKehamilan: jarakKehamilan ? Number(jarakKehamilan) : null,
      hipertensi,
      diabetes,
      jantung,
      anemia,
      preeklamsia,
      tindakanPersalinan,
      perdarahanPersalinan,
      kembar,
      sungsangLintang,
      lainLain: lainLain.trim() || undefined,
      markPresent,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#F9D5E2] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#F9D5E2] flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E62E76] to-[#FB7185] text-white flex items-center justify-center shadow-sm">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                Pendaftaran Ibu Hamil Baru
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Kelas {activePustu.label}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Data Diri */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15805D] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#15805D]" />
              <span>1. Data Diri &amp; Kontak</span>
            </div>

            <div className="space-y-3.5">
              {pustuList && pustuList.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Wilayah Pustu / Kelas Ibu Hamil <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedPustuId}
                    onChange={(e) => setSelectedPustuId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none bg-white font-medium text-gray-800"
                  >
                    {pustuList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label} ({p.kelurahan})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Lengkap Ibu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai KTP"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Suami
                  </label>
                  <input
                    type="text"
                    placeholder="Nama suami"
                    value={suami}
                    onChange={(e) => setSuami(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tglLahir}
                    onChange={(e) => setTglLahir(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none cursor-pointer"
                  />
                  {age !== null && age > 0 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Usia ibu: <strong className="text-gray-800">{age} tahun</strong>
                      {age < 20 && <span className="text-rose-600 font-bold ml-1">(Usia muda)</span>}
                      {age > 35 && <span className="text-rose-600 font-bold ml-1">(Usia lanjut)</span>}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Alamat Domisili <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jl. Melati, RT/RW, Kelurahan"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Riwayat Kehamilan & HPHT */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E62E76] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E62E76]" />
              <span>2. Riwayat Kehamilan (GPA &amp; HPHT)</span>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Gravida (Hamil ke-) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={gravida}
                    onChange={(e) => setGravida(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] focus:border-transparent outline-none"
                  />
                  <span className="text-[10px] text-gray-400">Total kehamilan</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Paritas (Lahir Hidup)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={paritas}
                    onChange={(e) => setParitas(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] focus:border-transparent outline-none"
                  />
                  <span className="text-[10px] text-gray-400">Jumlah anak lahir</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Abortus (Keguguran)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={abortus}
                    onChange={(e) => setAbortus(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] focus:border-transparent outline-none"
                  />
                  <span className="text-[10px] text-gray-400">Riwayat keguguran</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  HPHT (Hari Pertama Haid Terakhir) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={hpht}
                  onChange={(e) => setHpht(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] focus:border-transparent outline-none cursor-pointer"
                />

                {/* Naegele preview */}
                {hplDate && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#FFF5F7] border border-[#F9D5E2] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-[#E62E76]" />
                      <span>
                        Taksiran Persalinan (HPL):{' '}
                        <strong className="text-[#E62E76] font-bold">
                          {formatDateIndo(hplDate)}
                        </strong>
                      </span>
                    </div>
                    {daysToHpl !== null && daysToHpl > 0 && (
                      <span className="text-gray-500 font-semibold text-[11px]">
                        ({daysToHpl} hari lagi)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Antropometri (TB, BB, LILA, Jarak) */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>3. Antropometri &amp; Pengukuran Fisik</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  placeholder="mis. 155"
                  value={tinggiBadan}
                  onChange={(e) => setTinggiBadan(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="mis. 55"
                  value={beratBadan}
                  onChange={(e) => setBeratBadan(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  LILA (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="mis. 24.5"
                  value={lila}
                  onChange={(e) => setLila(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  title="Lingkar Lengan Atas (standar Kemenkes < 23.5 cm = Risiko KEK)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Jarak Anak (th)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="mis. 2.5"
                  value={jarakKehamilan}
                  onChange={(e) => setJarakKehamilan(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* BMI preview */}
            {bmiVal !== null && (
              <p className="text-xs text-gray-600 mt-2">
                IMT Otomatis: <strong className="text-gray-900">{bmiVal}</strong> (
                <span className={bmiInfo.color}>{bmiInfo.label}</span>)
              </p>
            )}
            {lilaNum !== null && lilaNum < 23.5 && (
              <p className="text-xs text-rose-600 font-bold mt-1">
                ⚠ LILA &lt; 23.5 cm menunjukkan risiko Kurang Energi Kronis (KEK).
              </p>
            )}
          </div>

          {/* Section 4: Penapisan Risiko Tinggi & Komplikasi */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                <span>4. Penapisan Faktor Risiko Medis &amp; Obstetri</span>
              </div>
              <span className="text-[11px] text-gray-400">Centang jika ditemukan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Riwayat Hipertensi Kronis', checked: hipertensi, set: setHipertensi },
                { label: 'Riwayat Diabetes Melitus', checked: diabetes, set: setDiabetes },
                { label: 'Penyakit Jantung', checked: jantung, set: setJantung },
                { label: 'Anemia dalam Kehamilan', checked: anemia, set: setAnemia },
                { label: 'Riwayat / Gejala Preeklamsia', checked: preeklamsia, set: setPreeklamsia },
                {
                  label: 'Riwayat Persalinan Tindakan (SC/Vakum/Forsep)',
                  checked: tindakanPersalinan,
                  set: setTindakanPersalinan,
                },
                {
                  label: 'Riwayat Perdarahan Pascasalin Sebelumnya',
                  checked: perdarahanPersalinan,
                  set: setPerdarahanPersalinan,
                },
                { label: 'Kehamilan Kembar (Gemelli)', checked: kembar, set: setKembar },
                {
                  label: 'Kelainan Letak (Sungsang / Lintang)',
                  checked: sungsangLintang,
                  set: setSungsangLintang,
                },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                    item.checked
                      ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E11D48] accent-[#E11D48] cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Kondisi / Penyakit Lainnya (jika ada)
              </label>
              <input
                type="text"
                placeholder="mis. Asma, alergi obat, riwayat operasi..."
                value={lainLain}
                onChange={(e) => setLainLain(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Real-time High Risk Alert Banner */}
          {isRiskDetected ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-[#E11D48] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  Terdeteksi {detectedRisks.length} Faktor Risiko Tinggi Kehamilan:
                </h4>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {detectedRisks.map((risk, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-700 shadow-2xs"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-rose-600 mt-1.5">
                  Ibu akan otomatis ditandai sebagai prioritas pemantauan Bidan Puskesmas Kuranji.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Check size={16} className="text-emerald-600" />
              <span>Kondisi kehamilan saat ini tergolong Risiko Rendah (Normal).</span>
            </div>
          )}

          {/* Auto attendance checkbox */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={markPresent}
                onChange={(e) => setMarkPresent(e.target.checked)}
                className="w-4 h-4 rounded text-[#15805D] accent-[#15805D] cursor-pointer"
              />
              <span>Langsung catat HADIR pada pertemuan aktif saat ini</span>
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#E62E76] to-[#F43F5E] text-white hover:from-[#D41A63] hover:to-[#E11D48] shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Simpan Data Ibu Hamil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
