import React from 'react';
import { X, BookOpen, Heart, AlertTriangle, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ClassGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassGuideModal: React.FC<ClassGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#F9D5E2] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#F9D5E2] flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15805D] flex items-center justify-center shadow-xs">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                Panduan Standar Kelas Ibu Hamil
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Puskesmas Kuranji &amp; Kementerian Kesehatan RI
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

        {/* Body Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* 1. Target & Konsep Dasar */}
          <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#F9D5E2] space-y-2">
            <h3 className="font-heading font-bold text-[#E62E76] flex items-center gap-1.5 text-base">
              <Users size={18} />
              <span>Target Peserta &amp; Tujuan Kegiatan</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Kelas Ibu Hamil di Puskesmas Kuranji diselenggarakan per wilayah PUSTU dengan target <strong>15 ibu hamil per kelas</strong>. Tujuannya adalah meningkatkan pengetahuan, merubah sikap dan perilaku ibu agar memahami kehamilan, persalinan, nifas, pencegahan komplikasi, serta perawatan bayi baru lahir.
            </p>
          </div>

          {/* 2. Standar 4 Pertemuan & Materi Sesuai Juknis */}
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="font-heading font-bold text-[#15805D] flex items-center gap-1.5 text-base">
                <CheckCircle2 size={18} />
                <span>Materi 4 Pertemuan Kelas Ibu Hamil (Juknis Kemenkes RI)</span>
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF0F5] text-[#E62E76] border border-[#F9D5E2]">
                Wajib Minimal 4x Hadir
              </span>
            </div>

            {/* Banner Pendampingan Suami / Keluarga */}
            <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#F9D5E2] mb-3 text-center">
              <p className="text-xs font-bold text-[#BE123C]">
                &quot;Ibu hamil menghadiri Kelas Ibu setidaknya 4x (minimal 1x didampingi oleh suami/keluarga)&quot;
              </p>
            </div>

            {/* Grid 4 Pertemuan Materi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Pertemuan I */}
              <div className="p-3.5 rounded-2xl border border-pink-200 bg-pink-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#E62E76] text-sm font-heading">
                    Pertemuan I
                  </span>
                  <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                    Modul 1
                  </span>
                </div>
                <p className="font-bold text-gray-900 leading-snug">
                  Perawatan dan Pemantauan Kehamilan Agar Ibu dan Janin Sehat
                </p>
              </div>

              {/* Pertemuan II */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#15805D] text-sm font-heading">
                    Pertemuan II
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Modul 2
                  </span>
                </div>
                <p className="font-bold text-gray-900 leading-snug">
                  Persalinan Aman, Nifas Nyaman, Ibu Selamat, Bayi Sehat
                </p>
              </div>

              {/* Pertemuan III */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#15805D] text-sm font-heading">
                    Pertemuan III
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Modul 3
                  </span>
                </div>
                <p className="font-bold text-gray-900 leading-snug">
                  Pencegahan Penyakit dan Komplikasi Kehamilan, Persalinan dan Nifas Agar Ibu dan Bayi Sehat
                </p>
              </div>

              {/* Pertemuan IV */}
              <div className="p-3.5 rounded-2xl border border-pink-200 bg-pink-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#E62E76] text-sm font-heading">
                    Pertemuan IV
                  </span>
                  <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                    Modul 4
                  </span>
                </div>
                <p className="font-bold text-gray-900 leading-snug">
                  Perawatan Bayi Baru Lahir Agar Tumbuh Kembang Optimal
                </p>
              </div>
            </div>
          </div>

          {/* 3. Kriteria Penapisan Risiko Tinggi */}
          <div>
            <h3 className="font-heading font-bold text-[#E11D48] flex items-center gap-1.5 text-base mb-3">
              <AlertTriangle size={18} />
              <span>15+ Kriteria Ibu Hamil Risiko Tinggi (Penapisan Kemenkes)</span>
            </h3>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-900 font-medium">
                <div>• Usia terlalu muda (&lt; 20 tahun)</div>
                <div>• Usia terlalu tua (&gt; 35 tahun)</div>
                <div>• Terlalu banyak anak (Grande multipara, hamil ke-4+)</div>
                <div>• Jarak anak terlalu dekat (&lt; 2 tahun)</div>
                <div>• Tinggi badan kurang (&lt; 145 cm)</div>
                <div>• LILA &lt; 23.5 cm (Kurang Energi Kronis / KEK)</div>
                <div>• IMT Kurus (&lt;18.5) atau Obesitas (&ge;27)</div>
                <div>• Riwayat keguguran berulang</div>
                <div>• Riwayat persalinan sesar / tindakan vakum</div>
                <div>• Riwayat perdarahan pascasalin sebelumnya</div>
                <div>• Riwayat hipertensi kronis / preeklamsia</div>
                <div>• Diabetes melitus / penyakit jantung</div>
                <div>• Kehamilan kembar (gemelli)</div>
                <div>• Kelainan letak janin (sungsang / melintang)</div>
              </div>
              <p className="text-[11px] text-rose-700 pt-2 border-t border-rose-200">
                Ibu yang memenuhi salah satu kriteria di atas otomatis ditandai dengan label <strong>Risiko Tinggi</strong> pada dasbor sistem untuk mempermudah monitoring bidan dan kader posyandu.
              </p>
            </div>
          </div>

          {/* 4. Arti Singkatan G-P-A */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1">
            <h4 className="font-bold text-gray-900 font-heading">
              Memahami Format Obstetri: G - P - A
            </h4>
            <p className="text-gray-600 leading-relaxed">
              <strong>G (Gravida)</strong>: Jumlah keseluruhan kehamilan yang pernah dialami (termasuk kehamilan saat ini).<br />
              <strong>P (Paritas)</strong>: Jumlah persalinan bayi yang lahir hidup setelah usia viabel.<br />
              <strong>A (Abortus)</strong>: Riwayat keguguran atau kegagalan kehamilan sebelum janin viabel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#15805D] text-white hover:bg-[#0E6146] transition-colors cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
