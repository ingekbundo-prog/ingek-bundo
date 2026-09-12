import React from 'react';
import { Users, UserCheck, AlertTriangle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatsBarProps {
  totalIbu: number;
  hadirSesiIni: number;
  targetPerSesi: number;
  totalRisikoTinggi: number;
  avgAttendancePct: number;
  trimesterStats: { t1: number; t2: number; t3: number };
  isOnlyRiskFiltered: boolean;
  onToggleRiskFilter: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalIbu,
  hadirSesiIni,
  targetPerSesi,
  totalRisikoTinggi,
  avgAttendancePct,
  trimesterStats,
  isOnlyRiskFiltered,
  onToggleRiskFilter,
}) => {
  const targetPct = Math.min(100, Math.round((hadirSesiIni / targetPerSesi) * 100));
  const isTargetMet = hadirSesiIni >= targetPerSesi;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E62E76', '#15805D', '#F59E0B', '#F472B6'],
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Terdaftar */}
      <div className="bg-white rounded-2xl p-4.5 border border-[#F9D5E2] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Ibu Terdaftar
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FFF1F5] flex items-center justify-center text-[#E62E76]">
            <Users size={18} />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-extrabold text-[#21352D]">
            {totalIbu}
          </span>
          <span className="text-xs font-semibold text-gray-500">Ibu Hamil</span>
        </div>

        {/* Trimester distribution pills */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
          <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
            T1: {trimesterStats.t1}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700">
            T2: {trimesterStats.t2}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700">
            T3: {trimesterStats.t3}
          </span>
        </div>
      </div>

      {/* 2. Hadir Pertemuan Ini (Progress bar & Target 15) */}
      <div className="bg-white rounded-2xl p-4.5 border border-[#F9D5E2] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Hadir Pertemuan Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#E6F7F0] flex items-center justify-center text-[#15805D]">
            <UserCheck size={18} />
          </div>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-extrabold text-[#15805D]">
              {hadirSesiIni}
            </span>
            <span className="text-sm font-bold text-gray-400">/ {targetPerSesi} target</span>
          </div>

          {isTargetMet && (
            <button
              onClick={triggerConfetti}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15805D] border border-[#86EFAC] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Target 15 ibu hamil tercapai! Klik untuk rayakan"
            >
              <Sparkles size={11} className="text-amber-500" />
              Tercapai!
            </button>
          )}
        </div>

        {/* Progress Bar towards Target */}
        <div className="mt-3">
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isTargetMet
                  ? 'bg-gradient-to-r from-[#15805D] to-[#10B981]'
                  : targetPct >= 60
                  ? 'bg-gradient-to-r from-amber-500 to-[#15805D]'
                  : 'bg-gradient-to-r from-[#E62E76] to-amber-500'
              }`}
              style={{ width: `${targetPct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] font-medium text-gray-500">
            <span>{targetPct}% terpenuhi</span>
            <span>Target Kemenkes: 15</span>
          </div>
        </div>
      </div>

      {/* 3. Ibu Risiko Tinggi */}
      <div
        onClick={onToggleRiskFilter}
        className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md ${
          isOnlyRiskFiltered
            ? 'bg-[#FFF1F2] border-[#FDA4AF] ring-2 ring-[#E11D48]/30'
            : 'bg-white border-[#F9D5E2]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Ibu Risiko Tinggi
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-[#E11D48]">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-extrabold text-[#E11D48]">
            {totalRisikoTinggi}
          </span>
          <span className="text-xs font-semibold text-gray-500">Perlu Pemantauan</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
          <span className="text-rose-600">
            {isOnlyRiskFiltered ? '✓ Sedang difilter' : 'Klik untuk filter risiko'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px]">
            Prioritas
          </span>
        </div>
      </div>

      {/* 4. Rata-rata Kehadiran */}
      <div className="bg-white rounded-2xl p-4.5 border border-[#F9D5E2] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Rerata Kehadiran
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-heading text-3xl font-extrabold text-[#D97706]">
            {avgAttendancePct}%
          </span>
          <span className="text-xs font-semibold text-gray-500">Seluruh Sesi</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
          <CheckCircle2 size={13} className="text-[#15805D]" />
          <span>Dari 4 pertemuan terencana</span>
        </div>
      </div>
    </div>
  );
};
