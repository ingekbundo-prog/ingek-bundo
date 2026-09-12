import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { AlertTriangle, Trash2, X, ShieldAlert, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface DeletePatientModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (patientId: number) => void;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  patient,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);

  // Reset state whenever modal opens or patient changes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setConfirmedCheckbox(false);
    }
  }, [isOpen, patient]);

  if (!isOpen || !patient) return null;

  const handleProceedToStep2 = () => {
    setStep(2);
  };

  const handleFinalDelete = () => {
    onConfirmDelete(patient.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Batal"
        >
          <X size={18} />
        </button>

        {/* Two-step progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
            <span className={step === 1 ? 'text-amber-600 font-extrabold' : 'text-emerald-600'}>
              {step === 2 ? '✓ Verifikasi 1 Selesai' : 'Verifikasi 1: Konfirmasi'}
            </span>
            <span className={step === 2 ? 'text-rose-600 font-extrabold' : 'text-gray-400'}>
              Verifikasi 2: Persetujuan Akhir
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                step === 1 ? 'w-1/2 bg-amber-500' : 'w-full bg-rose-500'
              }`}
            />
          </div>
        </div>

        {/* STEP 1: First Verification */}
        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-heading text-lg font-bold text-gray-900 text-center">
              Verifikasi 1 dari 2
            </h3>
            <p className="text-xs text-gray-500 text-center mt-0.5">
              Konfirmasi Penghapusan Data Ibu Hamil
            </p>

            {/* Target Patient Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FCE4EC] text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Nama Pasien:</span>
                <span className="text-xs font-bold uppercase tracking-wide bg-pink-100 text-[#E62E76] px-2 py-0.5 rounded-md">
                  {patient.pustu}
                </span>
              </div>
              <p className="text-base font-extrabold text-gray-900 mt-1">{patient.nama}</p>
              {patient.suami && (
                <p className="text-xs text-gray-600 mt-0.5">
                  Suami: <span className="font-semibold">{patient.suami}</span>
                </p>
              )}
              {patient.alamat && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  Alamat: {patient.alamat}
                </p>
              )}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Perhatian:</strong> Apakah Anda yakin ingin menghapus data ibu di atas? Silakan klik tombol di bawah untuk melanjutkan ke tahap verifikasi akhir.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>Lanjut ke Tahap 2</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Final Verification */}
        {step === 2 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200 animate-pulse">
              <ShieldAlert size={24} />
            </div>

            <h3 className="font-heading text-lg font-bold text-rose-600 text-center">
              Verifikasi 2 dari 2 (Terakhir)
            </h3>
            <p className="text-xs text-gray-500 text-center mt-0.5">
              Peringatan Keamanan & Tindakan Permanen
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-left">
              <p className="text-xs text-rose-900 leading-relaxed">
                Data atas nama <strong>&quot;{patient.nama}&quot;</strong> beserta seluruh riwayat presensi pertemuan dan rekam faktor risiko kehamilan akan <strong>dihapus secara permanen</strong> dan tidak dapat dikembalikan.
              </p>
            </div>

            {/* Verification Checkbox */}
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedCheckbox}
                  onChange={(e) => setConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Saya sadar dan yakin ingin menghapus data ibu <strong>{patient.nama}</strong> secara permanen.
                </span>
              </label>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                disabled={!confirmedCheckbox}
                onClick={handleFinalDelete}
                className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  confirmedCheckbox
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95 shadow-rose-500/20'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
