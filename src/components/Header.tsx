import React, { useState } from 'react';
import { Plus, BookOpen, Download, Heart, QrCode, LogOut, UserCheck } from 'lucide-react';
import { LogoBadge } from './LogoBadge';
import { SpecialThanksModal } from './SpecialThanksModal';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onOpenQrModal: () => void;
  onExportCsv: () => void;
  onLogout?: () => void;
  currentUser?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenGuideModal,
  onOpenQrModal,
  onExportCsv,
  onLogout,
  currentUser = 'kuranji',
}) => {
  const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#F9D5E2] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative" title="Logo Resmi INGEK BUNDO - Klik untuk pasang file asli (logo ingek bundo.jpeg)">
              <LogoBadge size="lg" allowUpload={true} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide flex items-center gap-1 font-heading">
                  <span className="text-[#E62E76] drop-shadow-xs">INGEK</span>
                  <span className="text-[#15805D] flex items-center">
                    BUNDO
                    <button
                      type="button"
                      onClick={() => setIsThanksModalOpen(true)}
                      className="inline-flex items-center p-1 -m-1 rounded-full hover:bg-pink-100/60 transition-transform active:scale-90 cursor-pointer"
                      title="Klik untuk melihat pesan rahasia"
                      aria-label="Pesan Terima Kasih"
                    >
                      <Heart size={18} className="fill-[#E62E76] text-[#E62E76] animate-pulse hover:scale-125 transition-transform" />
                    </button>
                  </span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15805D] border border-[#86EFAC]/50">
                  Puskesmas Kuranji
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0F5] text-[#BE123C] border border-[#F9D5E2]">
                  <UserCheck size={12} />
                  <span>@{currentUser}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                Sistem Pendataan, Presensi &amp; Pelacakan Risiko Tinggi Kelas Ibu Hamil
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            <button
              onClick={onOpenQrModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-[#E5E7EB] text-gray-700 hover:text-[#15805D] hover:border-[#15805D] hover:bg-[#E6F7F0]/40 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Tampilkan QR Code Website untuk di-scan"
            >
              <QrCode size={16} className="text-[#15805D]" />
              <span>QR Code</span>
            </button>

            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-[#E5E7EB] text-gray-700 hover:text-[#15805D] hover:border-[#15805D] hover:bg-[#E6F7F0]/40 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BookOpen size={16} className="text-[#15805D]" />
              <span>Panduan Kemenkes</span>
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-[#E5E7EB] text-gray-700 hover:text-[#E62E76] hover:border-[#E62E76] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Unduh Rekapitulasi Data Format CSV (Excel)"
            >
              <Download size={16} className="text-[#E62E76]" />
              <span>Ekspor Data</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#E62E76] to-[#F43F5E] text-white hover:from-[#D41A63] hover:to-[#E11D48] transition-all cursor-pointer shadow-md shadow-pink-500/20 active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Ibu Hamil Baru</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Keluar dari sistem"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Special Thanks Popup Modal */}
      <SpecialThanksModal
        isOpen={isThanksModalOpen}
        onClose={() => setIsThanksModalOpen(false)}
      />
    </header>
  );
};
