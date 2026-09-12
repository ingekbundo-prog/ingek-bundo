import React from 'react';
import { Patient, Session } from '../types';
import {
  calcAge,
  calcUsiaKehamilan,
  calcHPL,
  calcBMI,
  getBmiStatus,
  getRiskAnalysis,
  calcTotalHadir,
  formatDateIndo,
} from '../utils/calculator';
import { AlertTriangle, Heart, Check, X, MessageCircle, Eye, Trash2, Plus } from 'lucide-react';

interface MothersCardsProps {
  patients: Patient[];
  sessions: Session[];
  activeSessionId: string;
  onSetAttendance: (patientId: number, status: 'hadir' | 'tidak' | 'izin' | 'sakit' | null, reason?: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: number) => void;
  onOpenAddModal?: () => void;
}

export const MothersCards: React.FC<MothersCardsProps> = ({
  patients,
  sessions,
  activeSessionId,
  onSetAttendance,
  onSelectPatient,
  onDeletePatient,
  onOpenAddModal,
}) => {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-[#F9D5E2] shadow-xs max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1F5] flex items-center justify-center mx-auto text-[#E62E76] mb-3.5 shadow-2xs">
          <Heart size={32} className="fill-[#E62E76]/20" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-800">
          Belum Ada Data Ibu Hamil
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Semua daftar nama ibu hamil saat ini kosong atau tidak ada data yang sesuai filter pencarian. Mulai catat data baru dengan menekan tombol di bawah.
        </p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E62E76] to-[#F43F5E] text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 hover:from-[#D41A63] hover:to-[#E11D48] transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Daftarkan Ibu Hamil Baru</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((pt) => {
        const age = calcAge(pt.tglLahir);
        const gest = calcUsiaKehamilan(pt.hpht);
        const hpl = calcHPL(pt.hpht);
        const bmi = calcBMI(pt.tinggiBadan, pt.beratBadan);
        const bmiInfo = getBmiStatus(bmi);
        const risks = getRiskAnalysis(pt);
        const isHighRisk = risks.length > 0;

        const currentAtt = pt.attendance[activeSessionId] || { status: null, alasan: '' };
        const totalHadir = calcTotalHadir(pt);

        const trimesterBg =
          gest.trimester === 1
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : gest.trimester === 2
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-rose-50 text-rose-700 border-rose-200';

        return (
          <div
            key={pt.id}
            className={`rounded-2xl border transition-all p-4.5 bg-white shadow-xs hover:shadow-md flex flex-col justify-between ${
              isHighRisk ? 'border-rose-300 ring-1 ring-rose-200/60 bg-rose-50/20' : 'border-[#F9D5E2]'
            }`}
          >
            <div>
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => onSelectPatient(pt)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer shadow-xs ${
                      isHighRisk
                        ? 'bg-[#FFE4E6] text-[#E11D48] ring-1 ring-[#FDA4AF]'
                        : 'bg-[#E6F7F0] text-[#15805D]'
                    }`}
                  >
                    {pt.nama.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <button
                      onClick={() => onSelectPatient(pt)}
                      className="font-heading font-bold text-gray-900 hover:text-[#E62E76] text-base text-left transition-colors"
                    >
                      {pt.nama}
                    </button>
                    <div className="text-xs text-gray-500">
                      {age > 0 ? `${age} th` : ''} · G{pt.gravida}P{pt.paritas}A{pt.abortus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPatient(pt)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#15805D] hover:bg-[#E6F7F0]"
                    title="Lihat Detail"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onDeletePatient(pt.id)}
                    className="p-1 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Badges & Pregnancy info */}
              <div className="mt-3 flex items-center flex-wrap gap-1.5 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold border ${trimesterBg}`}>
                  {gest.text} (TM {gest.trimester})
                </span>

                {hpl && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    HPL: {formatDateIndo(hpl)}
                  </span>
                )}

                {bmi !== null && (
                  <span className={`px-2 py-0.5 rounded-full bg-gray-50 border ${bmiInfo.color}`}>
                    {bmiInfo.label}
                  </span>
                )}
              </div>

              {/* High risk tags */}
              {isHighRisk && (
                <div className="mt-2.5 p-2 rounded-xl bg-rose-100/70 border border-rose-200">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#E11D48] mb-1">
                    <AlertTriangle size={13} />
                    <span>Risiko Tinggi:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {risks.map((r) => (
                      <span
                        key={r.id}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-rose-800 shadow-2xs"
                      >
                        {r.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4 Attendance Stamps */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Kehadiran 4 Sesi:</span>
                <div className="flex items-center gap-1">
                  {sessions.map((sess) => {
                    const isPresent = pt.attendance[sess.id]?.status === 'hadir';
                    return (
                      <div
                        key={sess.id}
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isPresent
                            ? 'bg-[#15805D] border-[#15805D] text-white'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}
                        title={`${sess.label}: ${isPresent ? 'Hadir' : 'Belum'}`}
                      >
                        <Heart size={10} className={isPresent ? 'fill-white' : ''} />
                      </div>
                    );
                  })}
                  <span className="ml-1 text-[11px] font-bold text-gray-700">
                    {totalHadir}/4
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Presensi Sesi Ini */}
            <div className="mt-3.5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    onClick={() => onSetAttendance(pt.id, 'hadir')}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAtt.status === 'hadir'
                        ? 'bg-[#15805D] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#15805D]'
                    }`}
                  >
                    <Check size={13} strokeWidth={2.5} />
                    <span>Hadir</span>
                  </button>

                  <button
                    onClick={() => onSetAttendance(pt.id, 'tidak')}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAtt.status === 'tidak'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#E11D48]'
                    }`}
                  >
                    <X size={13} strokeWidth={2.5} />
                    <span>Absen</span>
                  </button>
                </div>

                {/* WhatsApp Button */}
                {pt.hp && (
                  <a
                    href={`https://wa.me/62${pt.hp.replace(/^0/, '')}?text=${encodeURIComponent(
                      `Halo Bunda ${pt.nama}, salam hangat dari Bidan Puskesmas Kuranji.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    title="Kirim pesan WhatsApp"
                  >
                    <MessageCircle size={16} className="fill-emerald-600 text-emerald-600" />
                  </a>
                )}
              </div>

              {/* Alasan jika tidak hadir */}
              {currentAtt.status === 'tidak' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Alasan tidak hadir..."
                    value={currentAtt.alasan || ''}
                    onChange={(e) => onSetAttendance(pt.id, 'tidak', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
