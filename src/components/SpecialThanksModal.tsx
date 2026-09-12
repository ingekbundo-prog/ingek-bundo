import React from 'react';
import { Heart, Sparkles, X } from 'lucide-react';

interface SpecialThanksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecialThanksModal: React.FC<SpecialThanksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 text-center space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-pink-50 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Icon & Sparkles */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-100 via-rose-100 to-pink-200 flex items-center justify-center shadow-inner">
            <Heart size={32} className="fill-[#E62E76] text-[#E62E76] animate-bounce" />
          </div>
          <Sparkles size={20} className="absolute -top-1 -right-1 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Title */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-pink-100 text-[#E62E76] mb-1.5">
            Special Thanks To
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug font-heading">
            Aisyah Raissa Zita
          </h3>
          <p className="text-xs font-semibold text-[#15805D] mt-0.5">
            (hidden member Kuranji)
          </p>
        </div>

        {/* Message Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50/80 via-white to-emerald-50/60 border border-pink-100/80 text-xs text-gray-700 leading-relaxed font-medium">
          &ldquo;Yang sudah berjasa membuatkan website ini tanpa pamrih.&rdquo;
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#E62E76] to-[#F43F5E] hover:from-[#D41A63] hover:to-[#E11D48] transition-all cursor-pointer shadow-md shadow-pink-500/20 active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Heart size={15} className="fill-white" />
          <span>Terima Kasih Banyak!</span>
        </button>
      </div>
    </div>
  );
};
