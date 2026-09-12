import React from 'react';
import { Session } from '../types';
import { OFFICIAL_SESSION_TOPICS, getTodayDateStr } from '../data/initialData';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Table,
  CheckSquare,
  BookOpen,
  Clock,
  Users,
} from 'lucide-react';
import { formatDateIndo } from '../utils/calculator';

interface SessionBarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onUpdateSessionDate: (sessionId: string, newDate: string) => void;
  onAddSession: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onlyRisk: boolean;
  onToggleOnlyRisk: () => void;
  statusFilter: string; // 'all' | 'hadir' | 'tidak' | 'belum'
  onStatusFilterChange: (status: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onMarkAllPresent: () => void;
  hasPatients?: boolean;
}

export const SessionBar: React.FC<SessionBarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onUpdateSessionDate,
  onAddSession,
  searchQuery,
  onSearchChange,
  onlyRisk,
  onToggleOnlyRisk,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onMarkAllPresent,
  hasPatients = false,
}) => {
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const todayStr = getTodayDateStr();

  // Find official Juknis topic for the active session
  const currentSessionIndex = sessions.findIndex((s) => s.id === activeSessionId);
  const meetingNum = currentSessionIndex >= 0 ? (currentSessionIndex % 4) + 1 : 1;
  const defaultTopic = OFFICIAL_SESSION_TOPICS[meetingNum - 1] || OFFICIAL_SESSION_TOPICS[0];
  const displayTopic = currentSession?.topik || defaultTopic;

  const handleSetToday = () => {
    if (currentSession) {
      onUpdateSessionDate(currentSession.id, todayStr);
    }
  };

  const romanNumerals: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
  const romanNum = romanNumerals[meetingNum] || `${meetingNum}`;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F9D5E2] shadow-xs space-y-4">
      {/* Row 1: Session Selector, Date Input with Today Button, and New Session Button */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 pb-3.5 border-b border-gray-100">
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Pertemuan Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FFF5F7] border border-[#F9D5E2] rounded-xl px-2.5 py-1.5">
            <Calendar size={16} className="text-[#E62E76] shrink-0" />
            <span className="text-xs font-bold text-gray-700 font-heading">Pertemuan:</span>
            <div className="relative">
              <select
                value={activeSessionId}
                onChange={(e) => onSelectSession(e.target.value)}
                className="pr-6 py-0.5 bg-transparent text-xs sm:text-sm font-extrabold text-[#1F2923] rounded-lg focus:outline-none cursor-pointer appearance-none"
              >
                {sessions.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {s.label} {s.tanggal ? `(${formatDateIndo(s.tanggal)})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Tanggal Pertemuan (Bisa Diedit / Masukin Hari Ini Langsung) */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1 shadow-2xs hover:border-[#E62E76] transition-colors">
            <Clock size={15} className="text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-600">Tanggal:</span>
            <input
              type="date"
              value={currentSession?.tanggal || todayStr}
              onChange={(e) => {
                if (currentSession && e.target.value) {
                  onUpdateSessionDate(currentSession.id, e.target.value);
                }
              }}
              className="text-xs sm:text-sm font-bold text-gray-800 focus:outline-none bg-transparent cursor-pointer"
              title="Tanggal pelaksanaan pertemuan (dapat diedit / sesuai kapan data dimasukkan)"
            />

            {/* Tombol Cepat: Hari Ini */}
            <button
              type="button"
              onClick={handleSetToday}
              className={`px-2 py-0.5 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                currentSession?.tanggal === todayStr
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-pink-100 hover:bg-pink-200 text-[#E62E76]'
              }`}
              title="Setel tanggal pertemuan langsung ke hari ini"
            >
              {currentSession?.tanggal === todayStr ? '✓ Hari Ini' : 'Set Hari Ini'}
            </button>
          </div>

          {/* Tambah Pertemuan Baru */}
          <button
            onClick={onAddSession}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-[#E5E7EB] text-gray-600 hover:text-[#15805D] hover:border-[#15805D] hover:bg-[#E6F7F0]/30 transition-all cursor-pointer active:scale-95"
            title="Tambah pertemuan baru untuk kelas ini"
          >
            <Plus size={14} />
            <span>Pertemuan Baru</span>
          </button>
        </div>

        {/* Quick helper tag */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-medium">
            Tanggal sesi: <strong className="text-gray-800">{formatDateIndo(currentSession?.tanggal || todayStr)}</strong>
          </span>
        </div>
      </div>

      {/* Row 2: Materi Pertemuan */}
      <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-[#FFF5F7] via-[#FFF9FA] to-[#F0FDF4] p-3 sm:p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#E62E76] text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-md bg-white text-[#E62E76] border border-pink-200">
                  Materi Pertemuan {romanNum}
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Juknis Kemenkes
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-1 leading-snug">
                {displayTopic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#BE123C] bg-white/90 border border-pink-200 px-3 py-1.5 rounded-xl self-start sm:self-center shrink-0 shadow-2xs">
            <Users size={14} className="text-[#E62E76] shrink-0" />
            <span>Min. 1x didampingi suami / keluarga</span>
          </div>
        </div>
      </div>

      {/* Row 3: Search, Filter, Quick Actions, View switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama ibu, suami, alamat, HP..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15805D] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right filters & controls */}
        <div className="flex items-center flex-wrap gap-2.5 justify-between sm:justify-end">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="py-1.5 px-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Presensi</option>
              <option value="hadir">Sudah Hadir</option>
              <option value="tidak">Tidak Hadir</option>
              <option value="belum">Belum Dicatat</option>
            </select>
          </div>

          {/* High Risk Filter Checkbox */}
          <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-rose-50/70 hover:bg-rose-100/70 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors">
            <input
              type="checkbox"
              checked={onlyRisk}
              onChange={onToggleOnlyRisk}
              className="w-4 h-4 rounded text-[#E11D48] accent-[#E11D48] cursor-pointer"
            />
            <span className="text-[#BE123C]">Hanya Risiko Tinggi</span>
          </label>

          {/* Quick Mark All Present */}
          <button
            onClick={onMarkAllPresent}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#E6F7F0] text-[#15805D] hover:bg-[#DCFCE7] border border-[#A7F3D0] transition-colors cursor-pointer"
            title="Tandai semua ibu yang belum absen sebagai hadir"
          >
            <CheckSquare size={13} />
            <span className="hidden md:inline">Semua Hadir</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 bg-gray-100 rounded-xl border border-gray-200">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#15805D] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Tampilan Tabel Rinci"
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-[#E62E76] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Tampilan Kartu Interaktif"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
