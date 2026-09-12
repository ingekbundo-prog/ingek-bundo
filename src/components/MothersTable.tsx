import React from 'react';
import { Patient, Session } from '../types';
import {
  calcAge,
  calcUsiaKehamilan,
  calcHPL,
  calcDaysToHpl,
  calcBMI,
  getBmiStatus,
  getRiskAnalysis,
  calcTotalHadir,
  formatDateIndo,
} from '../utils/calculator';
import {
  AlertTriangle,
  Heart,
  Check,
  X,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Calendar,
  Sparkles,
  Plus,
} from 'lucide-react';

interface MothersTableProps {
  patients: Patient[];
  sessions: Session[];
  activeSessionId: string;
  onSetAttendance: (patientId: number, status: 'hadir' | 'tidak' | 'izin' | 'sakit' | null, reason?: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: number) => void;
  onOpenAddModal?: () => void;
}

export const MothersTable: React.FC<MothersTableProps> = ({
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

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="bg-white rounded-2xl border border-[#F9D5E2] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#FFF5F7] border-b border-[#F9D5E2] text-[#5C6862] text-xs uppercase tracking-wider font-heading font-semibold">
              <th className="py-3.5 px-4 sm:px-5">Nama Ibu &amp; Kontak</th>
              <th className="py-3.5 px-4">Usia &amp; Kehamilan</th>
              <th className="py-3.5 px-4">G - P - A &amp; IMT</th>
              <th className="py-3.5 px-4">Riwayat 4 Pertemuan</th>
              <th className="py-3.5 px-4 min-w-[240px]">
                <div className="flex flex-col normal-case">
                  <span>Presensi {activeSession?.label || 'Sesi Ini'}</span>
                  {activeSession?.tanggal && (
                    <span className="text-[10px] font-normal text-emerald-800">
                      ({formatDateIndo(activeSession.tanggal)})
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8EEEC]">
            {patients.map((pt) => {
              const age = calcAge(pt.tglLahir);
              const gest = calcUsiaKehamilan(pt.hpht);
              const hpl = calcHPL(pt.hpht);
              const daysToHpl = calcDaysToHpl(pt.hpht);
              const bmi = calcBMI(pt.tinggiBadan, pt.beratBadan);
              const bmiInfo = getBmiStatus(bmi);
              const risks = getRiskAnalysis(pt);
              const isHighRisk = risks.length > 0;

              const currentAtt = pt.attendance[activeSessionId] || { status: null, alasan: '' };
              const totalHadir = calcTotalHadir(pt);

              // Trimester styling
              const trimesterBg =
                gest.trimester === 1
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : gest.trimester === 2
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <tr
                  key={pt.id}
                  className={`transition-colors hover:bg-gray-50/80 ${
                    isHighRisk ? 'bg-rose-50/40' : ''
                  }`}
                >
                  {/* 1. Nama & Kontak */}
                  <td className="py-3.5 px-4 sm:px-5 align-top">
                    <div className="flex items-start gap-2.5">
                      <div
                        onClick={() => onSelectPatient(pt)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105 ${
                          isHighRisk
                            ? 'bg-[#FFE4E6] text-[#E11D48] ring-1 ring-[#FDA4AF]'
                            : 'bg-[#E6F7F0] text-[#15805D]'
                        }`}
                        title="Klik untuk lihat profil lengkap"
                      >
                        {pt.nama.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <button
                          onClick={() => onSelectPatient(pt)}
                          className="font-heading font-bold text-gray-900 hover:text-[#E62E76] text-sm sm:text-[15px] text-left transition-colors flex items-center gap-1.5 flex-wrap"
                        >
                          <span>{pt.nama}</span>
                          {isHighRisk && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#E11D48] border border-[#FECDD3]">
                              <AlertTriangle size={10} />
                              Risti
                            </span>
                          )}
                        </button>

                        {pt.suami && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Suami: <span className="font-medium text-gray-700">{pt.suami}</span>
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {pt.alamat}
                        </div>

                        {/* WhatsApp / Phone shortcut */}
                        {pt.hp && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <a
                              href={`https://wa.me/62${pt.hp.replace(/^0/, '')}?text=${encodeURIComponent(
                                `Halo Bunda ${pt.nama}, kami dari Kelas Ibu Hamil Puskesmas Kuranji ingin menginfokan jadwal pertemuan berikutnya. Sehat selalu ya Bunda!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors"
                              title="Kirim pesan pengingat WA"
                            >
                              <MessageCircle size={11} className="fill-emerald-600 text-emerald-600" />
                              <span>WA</span>
                            </a>
                            <span className="text-[11px] text-gray-400">{pt.hp}</span>
                          </div>
                        )}

                        {/* Risk tags preview */}
                        {isHighRisk && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {risks.slice(0, 2).map((r) => (
                              <span
                                key={r.id}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100/80 text-rose-800 border border-rose-200"
                              >
                                {r.title}
                              </span>
                            ))}
                            {risks.length > 2 && (
                              <span
                                onClick={() => onSelectPatient(pt)}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 cursor-pointer hover:underline"
                              >
                                +{risks.length - 2} faktor lain
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Usia & Kehamilan */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {age > 0 ? `${age} tahun` : '-'}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-700">{gest.text}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm border ${trimesterBg}`}
                        >
                          TM {gest.trimester}
                        </span>
                      </div>

                      {hpl && (
                        <div className="text-[11px] text-gray-500">
                          HPL: <span className="font-semibold text-gray-700">{formatDateIndo(hpl)}</span>
                          {daysToHpl !== null && daysToHpl > 0 && (
                            <span className="block text-[10px] text-gray-400">
                              ({daysToHpl} hari lagi)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 3. GPA & IMT */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 font-heading">
                          G{pt.gravida} P{pt.paritas} A{pt.abortus}
                        </span>
                      </div>

                      {bmi !== null ? (
                        <div className="text-xs">
                          <span className="text-gray-500 text-[11px]">IMT: {bmi}</span>
                          <span className={`block text-[10px] ${bmiInfo.color}`}>
                            {bmiInfo.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}

                      {pt.lila && (
                        <div className="text-[10px] text-gray-500">
                          LILA: <span className={pt.lila < 23.5 ? 'text-rose-600 font-bold' : 'font-medium'}>{pt.lila} cm</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 4. Riwayat 4 Pertemuan */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        {sessions.map((sess, idx) => {
                          const att = pt.attendance[sess.id]?.status;
                          const isPresent = att === 'hadir';
                          const isAbsent = att === 'tidak';

                          return (
                            <div
                              key={sess.id}
                              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                isPresent
                                  ? 'bg-[#15805D] border-[#15805D] text-white shadow-xs'
                                  : isAbsent
                                  ? 'bg-rose-500 border-rose-500 text-white'
                                  : 'bg-gray-100 border-gray-200 text-gray-300'
                              }`}
                              title={`${sess.label} (${formatDateIndo(sess.tanggal)}): ${
                                isPresent
                                  ? 'Hadir'
                                  : isAbsent
                                  ? `Tidak Hadir (${pt.attendance[sess.id]?.alasan || 'Tanpa keterangan'})`
                                  : 'Belum terdata'
                              }`}
                            >
                              {isPresent ? (
                                <Heart size={11} className="fill-white" />
                              ) : isAbsent ? (
                                <X size={11} strokeWidth={2.5} />
                              ) : (
                                <span className="text-[9px] font-bold text-gray-400">{idx + 1}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                        <span>{totalHadir} / 4 Hadir</span>
                        {totalHadir === 4 && (
                          <span className="text-amber-500 text-xs" title="Lulus 4 pertemuan lengkap!">
                            ★
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 5. Presensi Sesi Ini */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSetAttendance(pt.id, 'hadir')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            currentAtt.status === 'hadir'
                              ? 'bg-[#15805D] text-white ring-2 ring-[#15805D]/30 shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-[#15805D] hover:text-[#15805D]'
                          }`}
                        >
                          <Check size={13} strokeWidth={2.5} />
                          <span>Hadir</span>
                        </button>

                        <button
                          onClick={() => onSetAttendance(pt.id, 'tidak')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            currentAtt.status === 'tidak'
                              ? 'bg-[#E11D48] text-white ring-2 ring-[#E11D48]/30 shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-[#E11D48] hover:text-[#E11D48]'
                          }`}
                        >
                          <X size={13} strokeWidth={2.5} />
                          <span>Tidak Hadir</span>
                        </button>

                        {currentAtt.status && (
                          <button
                            onClick={() => onSetAttendance(pt.id, null)}
                            className="text-[11px] text-gray-400 hover:text-gray-600 px-1.5 py-1 rounded hover:bg-gray-100"
                            title="Reset presensi sesi ini"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* Input Alasan if Tidak Hadir */}
                      {currentAtt.status === 'tidak' && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Tulis alasan tidak hadir (mis: sakit, kerja)..."
                            value={currentAtt.alasan || ''}
                            onChange={(e) => onSetAttendance(pt.id, 'tidak', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
                          />
                          {/* Quick reason pills */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {['Demam / Sakit', 'Bekerja', 'Acara Keluarga', 'Mudik', 'Hujan Lebat'].map(
                              (reason) => (
                                <button
                                  key={reason}
                                  type="button"
                                  onClick={() => onSetAttendance(pt.id, 'tidak', reason)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                >
                                  {reason}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 6. Aksi */}
                  <td className="py-3.5 px-3 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectPatient(pt)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#15805D] hover:bg-[#E6F7F0] transition-colors"
                        title="Lihat Detail Profil & Riwayat"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => onDeletePatient(pt.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus data ibu"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
