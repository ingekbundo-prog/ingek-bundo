import React, { useState, useEffect, useMemo } from 'react';
import { Patient, Pustu, Session } from './types';
import { INITIAL_PUSTU, INITIAL_SESSIONS, INITIAL_PATIENTS } from './data/initialData';
import { Header } from './components/Header';
import { PustuTabs } from './components/PustuTabs';
import { StatsBar } from './components/StatsBar';
import { SessionBar } from './components/SessionBar';
import { MothersTable } from './components/MothersTable';
import { MothersCards } from './components/MothersCards';
import { AddMotherModal } from './components/AddMotherModal';
import { MotherDetailModal } from './components/MotherDetailModal';
import { AddSessionModal } from './components/AddSessionModal';
import { ClassGuideModal } from './components/ClassGuideModal';
import { QrCodeModal } from './components/QrCodeModal';
import { DeletePatientModal } from './components/DeletePatientModal';
import { calcUsiaKehamilan, getRiskAnalysis } from './utils/calculator';
import { exportToCsv } from './utils/exportCsv';
import { Heart, Info, AlertTriangle, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PATIENTS = 'ingek_bundo_patients_v2';
const STORAGE_KEY_SESSIONS = 'ingek_bundo_sessions_v3';

export default function App() {
  // Pustu list
  const [pustuList] = useState<Pustu[]>(INITIAL_PUSTU);
  const [activePustuId, setActivePustuId] = useState<string>('korong-gadang');

  // Sessions per Pustu
  const [sessions, setSessions] = useState<Record<string, Session[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved sessions', e);
      }
    }
    return INITIAL_SESSIONS;
  });

  // Active session for each pustu (mulai dari Pertemuan 1)
  const [activeSessionIds, setActiveSessionIds] = useState<Record<string, string>>({
    'korong-gadang': 'kg-s1',
    'kalumbuk': 'kl-s1',
  });

  // Patients roster
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      localStorage.removeItem('ingek_bundo_patients_v1');
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved patients', e);
    }
    return INITIAL_PATIENTS;
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // Filtering & controls
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyRisk, setOnlyRisk] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals & Popups
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; msg: string; isRisk?: boolean }>({
    show: false,
    msg: '',
  });

  const showToast = (msg: string, isRisk = false) => {
    setToast({ show: true, msg, isRisk });
    setTimeout(() => {
      setToast({ show: false, msg: '', isRisk: false });
    }, 3500);
  };

  const activePustu = useMemo(
    () => pustuList.find((p) => p.id === activePustuId) || pustuList[0],
    [pustuList, activePustuId]
  );

  const currentPustuSessions = useMemo(
    () => sessions[activePustuId] || [],
    [sessions, activePustuId]
  );

  const activeSessionId = useMemo(() => {
    return (
      activeSessionIds[activePustuId] ||
      currentPustuSessions[0]?.id ||
      's1'
    );
  }, [activeSessionIds, activePustuId, currentPustuSessions]);

  // Handle active session switch
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionIds((prev) => ({
      ...prev,
      [activePustuId]: sessionId,
    }));
  };

  // Patients belonging to current Pustu
  const currentPustuPatients = useMemo(() => {
    return patients.filter((pt) => pt.pustu === activePustuId);
  }, [patients, activePustuId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalIbu = currentPustuPatients.length;
    const hadirSesiIni = currentPustuPatients.filter(
      (pt) => pt.attendance[activeSessionId]?.status === 'hadir'
    ).length;
    const totalRisikoTinggi = currentPustuPatients.filter(
      (pt) => getRiskAnalysis(pt).length > 0
    ).length;

    // Trimester distribution
    let t1 = 0,
      t2 = 0,
      t3 = 0;
    currentPustuPatients.forEach((pt) => {
      const g = calcUsiaKehamilan(pt.hpht);
      if (g.trimester === 1) t1++;
      else if (g.trimester === 2) t2++;
      else t3++;
    });

    // Cumulative attendance percentage
    let totalMarks = 0;
    const totalPossible = currentPustuPatients.length * currentPustuSessions.length;
    currentPustuPatients.forEach((pt) => {
      currentPustuSessions.forEach((sess) => {
        if (pt.attendance[sess.id]?.status === 'hadir') totalMarks++;
      });
    });
    const avgAttendancePct = totalPossible
      ? Math.round((totalMarks / totalPossible) * 100)
      : 0;

    return {
      totalIbu,
      hadirSesiIni,
      totalRisikoTinggi,
      avgAttendancePct,
      trimesterStats: { t1, t2, t3 },
    };
  }, [currentPustuPatients, activeSessionId, currentPustuSessions]);

  // Filtered patients for display
  const filteredPatients = useMemo(() => {
    return currentPustuPatients.filter((pt) => {
      // Risk filter
      const risks = getRiskAnalysis(pt);
      if (onlyRisk && risks.length === 0) return false;

      // Status filter
      const att = pt.attendance[activeSessionId]?.status;
      if (statusFilter === 'hadir' && att !== 'hadir') return false;
      if (statusFilter === 'tidak' && att !== 'tidak') return false;
      if (statusFilter === 'belum' && att !== null && att !== undefined) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = pt.nama.toLowerCase().includes(q);
        const matchHusband = pt.suami?.toLowerCase().includes(q);
        const matchHp = pt.hp?.toLowerCase().includes(q);
        const matchAlamat = pt.alamat?.toLowerCase().includes(q);
        if (!matchName && !matchHusband && !matchHp && !matchAlamat) return false;
      }

      return true;
    });
  }, [currentPustuPatients, onlyRisk, statusFilter, searchQuery, activeSessionId]);

  // Counts helper for Pustu tabs
  const getPustuCounts = (pustuId: string) => {
    const pts = patients.filter((pt) => pt.pustu === pustuId);
    const risk = pts.filter((pt) => getRiskAnalysis(pt).length > 0).length;
    return { total: pts.length, risk };
  };

  // Set attendance handler
  const handleSetAttendance = (
    patientId: number,
    status: 'hadir' | 'tidak' | 'izin' | 'sakit' | null,
    reason?: string
  ) => {
    setPatients((prev) =>
      prev.map((pt) => {
        if (pt.id !== patientId) return pt;
        const currentAtt = pt.attendance[activeSessionId];
        const newAtt = {
          status,
          alasan: status === 'tidak' ? reason ?? currentAtt?.alasan ?? '' : '',
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        return {
          ...pt,
          attendance: {
            ...pt.attendance,
            [activeSessionId]: newAtt,
          },
        };
      })
    );

    // If attendance reached target of 15, trigger confetti!
    if (status === 'hadir' && stats.hadirSesiIni + 1 === activePustu.targetPerSesi) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E62E76', '#15805D', '#F59E0B'],
      });
      showToast('🎉 Selamat! Target 15 peserta kelas ibu hamil telah tercapai!');
    }
  };

  // Add new mother handler
  const handleAddPatient = (
    patientData: Omit<Patient, 'id' | 'attendance'> & { markPresent: boolean }
  ) => {
    const newId = Date.now();
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      attendance: patientData.markPresent
        ? {
            [activeSessionId]: {
              status: 'hadir',
              updatedAt: new Date().toISOString().slice(0, 10),
            },
          }
        : {},
    };

    setPatients((prev) => [newPatient, ...prev]);

    const risks = getRiskAnalysis(newPatient);
    if (risks.length > 0) {
      showToast(
        `⚠ ${newPatient.nama} berhasil didaftarkan — terdeteksi risiko tinggi kehamilan`,
        true
      );
    } else {
      showToast(`✓ ${newPatient.nama} berhasil didaftarkan dan dicatat hadir!`);
    }
  };

  // Delete mother handler (opens 2-step verification modal)
  const handleDeletePatient = (patientId: number) => {
    const pt = patients.find((p) => p.id === patientId);
    if (pt) {
      setPatientToDelete(pt);
    }
  };

  const handleConfirmDeletePatient = (patientId: number) => {
    const pt = patients.find((p) => p.id === patientId);
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    if (selectedPatient?.id === patientId) setSelectedPatient(null);
    showToast(`Data ibu "${pt?.nama || ''}" berhasil dihapus.`);
  };

  // Mark all unrecorded as present
  const handleMarkAllPresent = () => {
    if (
      confirm(
        `Tandai semua ibu hamil di ${activePustu.label} yang belum terdata sebagai HADIR pada pertemuan ini?`
      )
    ) {
      setPatients((prev) =>
        prev.map((pt) => {
          if (pt.pustu !== activePustuId) return pt;
          if (pt.attendance[activeSessionId]?.status) return pt;
          return {
            ...pt,
            attendance: {
              ...pt.attendance,
              [activeSessionId]: {
                status: 'hadir',
                updatedAt: new Date().toISOString().slice(0, 10),
              },
            },
          };
        })
      );
      showToast('Semua ibu berhasil ditandai Hadir!');
    }
  };

  // Add new session handler
  const handleAddSession = (label: string, tanggal: string, topik: string) => {
    const currentList = sessions[activePustuId] || [];
    const newId = `${activePustuId.slice(0, 2)}-s${currentList.length + 1}`;
    const newSession: Session = {
      id: newId,
      label,
      tanggal,
      topik: topik || undefined,
    };

    setSessions((prev) => ({
      ...prev,
      [activePustuId]: [...currentList, newSession],
    }));

    handleSelectSession(newId);
    showToast(`✓ ${label} berhasil ditambahkan.`);
  };

  // Update session date handler
  const handleUpdateSessionDate = (sessionId: string, newDate: string) => {
    setSessions((prev) => ({
      ...prev,
      [activePustuId]: (prev[activePustuId] || []).map((s) =>
        s.id === sessionId ? { ...s, tanggal: newDate } : s
      ),
    }));
  };

  // Export CSV handler
  const handleExportCsv = () => {
    exportToCsv(currentPustuPatients, currentPustuSessions, activePustu.label);
    showToast('✓ Rekapitulasi CSV berhasil diunduh.');
  };

  // Update clinical notes handler
  const handleUpdateNotes = (patientId: number, notes: string) => {
    setPatients((prev) =>
      prev.map((pt) => {
        if (pt.id === patientId) {
          return { ...pt, catatanBidan: notes };
        }
        return pt;
      })
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, catatanBidan: notes } : null));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F7] text-[#21352D]">
      {/* Top Navigation Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* PUSTU Tabs */}
        <PustuTabs
          pustuList={pustuList}
          activePustuId={activePustuId}
          onSelectPustu={(id) => {
            setActivePustuId(id);
            setSearchQuery('');
          }}
          getCounts={getPustuCounts}
        />

        {/* Interactive Stats Dashboard */}
        <StatsBar
          totalIbu={stats.totalIbu}
          hadirSesiIni={stats.hadirSesiIni}
          targetPerSesi={activePustu.targetPerSesi}
          totalRisikoTinggi={stats.totalRisikoTinggi}
          avgAttendancePct={stats.avgAttendancePct}
          trimesterStats={stats.trimesterStats}
          isOnlyRiskFiltered={onlyRisk}
          onToggleRiskFilter={() => setOnlyRisk(!onlyRisk)}
        />

        {/* Session Selector & Filter Bar */}
        <SessionBar
          sessions={currentPustuSessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onUpdateSessionDate={handleUpdateSessionDate}
          onAddSession={() => setIsAddSessionModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onlyRisk={onlyRisk}
          onToggleOnlyRisk={() => setOnlyRisk(!onlyRisk)}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMarkAllPresent={handleMarkAllPresent}
          hasPatients={currentPustuPatients.length > 0}
        />

        {/* Main List / View (Table or Cards) */}
        {viewMode === 'table' ? (
          <MothersTable
            patients={filteredPatients}
            sessions={currentPustuSessions}
            activeSessionId={activeSessionId}
            onSetAttendance={handleSetAttendance}
            onSelectPatient={setSelectedPatient}
            onDeletePatient={handleDeletePatient}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : (
          <MothersCards
            patients={filteredPatients}
            sessions={currentPustuSessions}
            activeSessionId={activeSessionId}
            onSetAttendance={handleSetAttendance}
            onSelectPatient={setSelectedPatient}
            onDeletePatient={handleDeletePatient}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {/* Operational Footnote & Reference */}
        <div className="p-4 rounded-2xl bg-white/80 border border-[#F9D5E2] text-xs text-gray-500 leading-relaxed shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-gray-700 font-bold font-heading">
            <Info size={15} className="text-[#E62E76]" />
            <span>Keterangan Standar Sistem Pendataan:</span>
          </div>
          <p>
            <strong>G - P - A</strong> = Gravida (total kehamilan) - Paritas (anak lahir hidup) - Abortus (riwayat keguguran). Baris atau kartu dengan aksen merah muda menandakan ibu terdeteksi <strong>Risiko Tinggi Kehamilan</strong> (usia &lt;20 atau &gt;35 tahun, grande multipara ke-4+, jarak kehamilan &lt;2 tahun, tinggi badan &lt;145 cm, IMT kurang/lebih, LILA &lt;23.5 cm, riwayat abortus/SC/perdarahan, hipertensi, diabetes, jantung, gemelli, sungsang/lintang, atau preeklamsia).
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#F9D5E2] bg-white/80 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-gray-700 font-heading">
            INGEK BUNDO · Puskesmas Kuranji Kota Padang
          </p>
          <p>
            Dikembangkan oleh Dokter Muda IKM-KK FK Universitas Andalas bersama Puskesmas Kuranji
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddMotherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activePustu={activePustu}
        pustuList={pustuList}
        activeSessionId={activeSessionId}
        onAddPatient={handleAddPatient}
      />

      <MotherDetailModal
        patient={selectedPatient}
        sessions={currentPustuSessions}
        onClose={() => setSelectedPatient(null)}
        onUpdateNotes={handleUpdateNotes}
        onDeletePatient={handleDeletePatient}
      />

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        pustuName={activePustu.label}
        nextSessionNumber={currentPustuSessions.length + 1}
        onAddSession={handleAddSession}
      />

      <ClassGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <DeletePatientModal
        isOpen={!!patientToDelete}
        patient={patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirmDelete={handleConfirmDeletePatient}
      />

      {/* Toast Alert */}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4.5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toast.isRisk
              ? 'bg-[#E11D48] text-white'
              : 'bg-[#21352D] text-white border border-gray-700'
          }`}
        >
          {toast.isRisk ? (
            <AlertTriangle size={17} className="text-white shrink-0" />
          ) : (
            <Check size={17} className="text-[#34D399] shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
