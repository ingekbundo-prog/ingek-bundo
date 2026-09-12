import React, { useState } from 'react';
import { X, Calendar, BookOpen, Sparkles } from 'lucide-react';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pustuName: string;
  nextSessionNumber: number;
  onAddSession: (label: string, tanggal: string, topik: string) => void;
}

export const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  onClose,
  pustuName,
  nextSessionNumber,
  onAddSession,
}) => {
  const [label, setLabel] = useState(`Pertemuan ${nextSessionNumber}`);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [topik, setTopik] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !tanggal) return;
    onAddSession(label.trim(), tanggal, topik.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F9D5E2] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF5F7] text-[#E62E76] flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900 text-base">
                Tambah Pertemuan Baru
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">{pustuName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nama / Judul Pertemuan
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tanggal Pelaksanaan
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] outline-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Materi Pokok / Topik Pembahasan (Juknis Kemenkes)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'Perawatan dan Pemantauan Kehamilan Agar Ibu dan Janin Sehat',
                'Persalinan Aman, Nifas Nyaman, Ibu Selamat, Bayi Sehat',
                'Pencegahan Penyakit dan Komplikasi Kehamilan, Persalinan dan Nifas Agar Ibu dan Bayi Sehat',
                'Perawatan Bayi Baru Lahir Agar Tumbuh Kembang Optimal',
              ].map((t, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTopik(t)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-pink-50 text-[#BE123C] hover:bg-pink-100 border border-pink-200 text-left transition-colors cursor-pointer"
                >
                  P{idx + 1}: {t}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Pilih materi di atas atau ketik materi kustom..."
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E62E76] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#E62E76] text-white hover:bg-[#D41A63] shadow-xs cursor-pointer"
            >
              Simpan Pertemuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
