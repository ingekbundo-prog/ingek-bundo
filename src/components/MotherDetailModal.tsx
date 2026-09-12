import React, { useState } from 'react';
import { Patient, Session } from '../types';
import {
  calcAge,
  calcUsiaKehamilan,
  calcHPL,
  calcDaysToHpl,
  calcBMI,
  getBmiStatus,
  getLilaStatus,
  getRiskAnalysis,
  formatDateIndo,
} from '../utils/calculator';
import {
  X,
  Heart,
  AlertTriangle,
  Calendar,
  MessageCircle,
  FileText,
  User,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MapPin,
  Save,
  Trash2,
} from 'lucide-react';

interface MotherDetailModalProps {
  patient: Patient | null;
  sessions: Session[];
  onClose: () => void;
  onUpdateNotes: (patientId: number, notes: string) => void;
  onDeletePatient?: (patientId: number) => void;
}

export const MotherDetailModal: React.FC<MotherDetailModalProps> = ({
  patient,
  sessions,
  onClose,
  onUpdateNotes,
  onDeletePatient,
}) => {
  const [notes, setNotes] = useState(patient?.catatanBidan || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!patient) return null;

  const age = calcAge(patient.tglLahir);
  const gest = calcUsiaKehamilan(patient.hpht);
  const hpl = calcHPL(patient.hpht);
  const daysToHpl = calcDaysToHpl(patient.hpht);
  const bmi = calcBMI(patient.tinggiBadan, patient.beratBadan);
  const bmiInfo = getBmiStatus(bmi);
  const lilaInfo = getLilaStatus(patient.lila);
  const risks = getRiskAnalysis(patient);
  const isHighRisk = risks.length > 0;

  const handleSaveNotes = () => {
    onUpdateNotes(patient.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Bunda ${patient.nama}, salam hangat dari Tim Bidan & Kader Kelas Ibu Hamil Puskesmas Kuranji.\n\nMengingatkan kembali jadwal kegiatan kelas ibu hamil berikutnya. Saat ini usia kehamilan Bunda sekitar ${gest.text} (taksiran persalinan: ${formatDateIndo(
      hpl
    )}).\n\nJangan lupa bawa Buku KIA ya Bunda! Sehat selalu untuk Bunda dan calon buah hati ❤️`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#F9D5E2] animate-in fade-in zoom-in-95 duration-200">
        {/* Header with gradient and patient summary */}
        <div className="relative bg-gradient-to-r from-[#FFF0F5] via-[#FFF5F7] to-[#E6F7F0] p-6 border-b border-[#F9D5E2] rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm ${
                isHighRisk
                  ? 'bg-[#FFE4E6] text-[#E11D48] ring-2 ring-[#FDA4AF]'
                  : 'bg-[#DCFCE7] text-[#15805D]'
              }`}
            >
              {patient.nama.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                  {patient.nama}
                </h2>
                {isHighRisk ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#E11D48] border border-[#FECDD3]">
                    <AlertTriangle size={12} />
                    Risiko Tinggi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15805D] border border-[#86EFAC]">
                    <CheckCircle2 size={12} />
                    Risiko Rendah (Normal)
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap font-medium">
                <span>{age} tahun</span>
                <span>•</span>
                <span>G{patient.gravida} P{patient.paritas} A{patient.abortus}</span>
                {patient.suami && (
                  <>
                    <span>•</span>
                    <span>Suami: {patient.suami}</span>
                  </>
                )}
              </p>

              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                <span>{patient.alamat}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Pregnancy Calculator Highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF5F7] p-4 rounded-2xl border border-[#FCE7F0]">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Usia Kehamilan
              </span>
              <span className="text-base sm:text-lg font-heading font-extrabold text-[#E62E76]">
                {gest.text}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 block">
                Trimester {gest.trimester}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Taksiran Lahir (HPL)
              </span>
              <span className="text-base sm:text-lg font-heading font-extrabold text-[#15805D]">
                {formatDateIndo(hpl)}
              </span>
              {daysToHpl !== null && (
                <span className="text-[11px] font-semibold text-gray-500 block">
                  {daysToHpl > 0 ? `${daysToHpl} hari lagi` : 'Mendekati persalinan'}
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Status Gizi (IMT)
              </span>
              <span className="text-base sm:text-lg font-heading font-extrabold text-gray-800">
                {bmi !== null ? bmi : '-'}
              </span>
              <span className={`text-[11px] block ${bmiInfo.color}`}>
                {bmiInfo.label}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Ukuran LILA
              </span>
              <span className="text-base sm:text-lg font-heading font-extrabold text-gray-800">
                {patient.lila ? `${patient.lila} cm` : '-'}
              </span>
              <span className={`text-[11px] font-semibold block ${patient.lila && patient.lila < 23.5 ? 'text-rose-600' : 'text-gray-500'}`}>
                {lilaInfo.label}
              </span>
            </div>
          </div>

          {/* High-Risk Assessment Breakdown */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 mb-2.5">
              <ShieldAlert size={16} className={isHighRisk ? 'text-[#E11D48]' : 'text-[#15805D]'} />
              <span>Evaluasi &amp; Faktor Risiko Ibu Hamil</span>
            </h3>

            {isHighRisk ? (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle size={14} className="text-[#E11D48]" />
                  <span>Ditemukan {risks.length} Faktor Risiko Tinggi yang Perlu Diperhatikan:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="p-2 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                      <span>{risk.title}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-rose-600 font-medium pt-1">
                  Rekomendasi Bidan: Lakukan rujukan terencana ke dokter SpOG Puskesmas / RSUD bila terdapat penyulit, pemantauan ketat tekanan darah, dan anjurkan persalinan di fasilitas pelayanan kesehatan mampu PONED.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 size={22} className="text-[#15805D] shrink-0" />
                <div className="text-xs text-emerald-800">
                  <strong className="block font-bold">Kehamilan Berjalan Normal (Risiko Rendah)</strong>
                  Tetap anjurkan ibu rutin konsumsi tablet tambah darah (TTD), asupan bergizi seimbang, dan ikuti 4 pertemuan kelas ibu hamil secara tuntas.
                </div>
              </div>
            )}
          </div>

          {/* 4 Sessions Attendance Timeline */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 mb-2.5">
              <Calendar size={16} className="text-[#E62E76]" />
              <span>Riwayat Kehadiran Kelas Ibu Hamil (4 Pertemuan)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sessions.map((sess) => {
                const att = patient.attendance[sess.id];
                const isPresent = att?.status === 'hadir';
                const isAbsent = att?.status === 'tidak';

                return (
                  <div
                    key={sess.id}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-3 ${
                      isPresent
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isAbsent
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-gray-50/60 border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900 font-heading">
                        {sess.label}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {formatDateIndo(sess.tanggal)}
                      </div>
                      {sess.topik && (
                        <div className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                          {sess.topik}
                        </div>
                      )}
                      {isAbsent && att.alasan && (
                        <div className="text-[11px] text-rose-700 mt-1 font-medium bg-white px-2 py-0.5 rounded border border-rose-200 inline-block">
                          Alasan: {att.alasan}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#15805D] text-white">
                          <Heart size={11} className="fill-white" />
                          Hadir
                        </span>
                      ) : isAbsent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E11D48] text-white">
                          <XCircle size={12} />
                          Absen
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                          Belum
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes by Midwife / Cadre */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 mb-2">
              <FileText size={16} className="text-gray-500" />
              <span>Catatan Khusus Bidan / Kader Posyandu</span>
            </h3>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan perkembangan, hasil konseling gizi, kepatuhan minum TTD, atau rencana rujukan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#15805D] focus:border-transparent outline-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-gray-400">
                Tersimpan di sistem pendataan Puskesmas Kuranji
              </span>
              <button
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#15805D] text-white hover:bg-[#0E6146] transition-colors cursor-pointer"
              >
                <Save size={13} />
                <span>{isSaved ? 'Tersimpan!' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Notification */}
          {patient.hp && (
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F0FDF4] p-3.5 rounded-2xl border border-[#BBF7D0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Kirim Pengingat Jadwal via WhatsApp
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Kirim pesan ke Bunda {patient.nama} ({patient.hp})
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/62${patient.hp.replace(/^0/, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <span>Buka WhatsApp</span>
                <span>→</span>
              </a>
            </div>
          )}

          {/* Action Footer: Delete Individual Mother & Close */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            {onDeletePatient ? (
              <button
                type="button"
                onClick={() => {
                  onDeletePatient(patient.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                title={`Hapus data ibu ${patient.nama}`}
              >
                <Trash2 size={13} />
                <span>Hapus Data Ibu Ini</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
