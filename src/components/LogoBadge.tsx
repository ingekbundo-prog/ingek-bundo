import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import logoImg from '../assets/logo-ingek-bundo.jpeg';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  allowUpload?: boolean;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  allowUpload = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem('ingek_bundo_uploaded_logo');
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomLogo(localStorage.getItem('ingek_bundo_uploaded_logo'));
      setImageError(false);
    };
    window.addEventListener('logo-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('logo-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('ingek_bundo_uploaded_logo', dataUrl);
        setCustomLogo(dataUrl);
        setImageError(false);
        window.dispatchEvent(new Event('logo-updated'));
      }
    };
    reader.readAsDataURL(file);
  };

  const sizeMap = {
    sm: { container: 'w-10 h-10', text: 'text-xs' },
    md: { container: 'w-14 h-14', text: 'text-sm' },
    lg: { container: 'w-20 h-20', text: 'text-base' },
    xl: { container: 'w-32 h-32', text: 'text-lg' },
  };

  const { container } = sizeMap[size];
  const activeLogoSrc = logoImg;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        onClick={() => {
          if (allowUpload && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={`relative ${container} rounded-full flex-shrink-0 shadow-md ring-3 ring-[#EC377E]/80 overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-[#FCE4EC] group ${
          allowUpload ? 'cursor-pointer' : ''
        }`}
        title="Logo Resmi INGEK BUNDO Puskesmas Kuranji"
      >
        {!imageError ? (
          <img
            src={activeLogoSrc}
            alt="Logo Resmi Ingek Bundo Puskesmas Kuranji"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Faithful vector fallback */
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer pink border is handled by container ring */}
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F5" />
                <stop offset="100%" stopColor="#FCE4EC" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A261A" />
                <stop offset="100%" stopColor="#2D150D" />
              </linearGradient>
              <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F6729B" />
                <stop offset="100%" stopColor="#E6447E" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.1" />
              </filter>
            </defs>

            {/* Background */}
            <circle cx="100" cy="100" r="96" fill="url(#bgGrad)" />

            {/* Background Heart & Glow left */}
            <path
              d="M 52 48 C 42 38, 28 46, 32 58 C 36 68, 52 82, 52 82 C 52 82, 68 68, 72 58 C 76 46, 62 38, 52 48 Z"
              fill="#F9A8D4"
              opacity="0.35"
            />
            {/* Heart rays */}
            <line x1="28" y1="36" x2="22" y2="30" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="52" x2="14" y2="52" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="68" x2="22" y2="74" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />

            {/* Puskesmas Kuranji Clinic Building (Right background) */}
            <g transform="translate(132, 52)">
              {/* Roof */}
              <polygon points="26,0 52,22 0,22" fill="#15805D" />
              {/* White Cross on roof */}
              <rect x="23" y="6" width="6" height="12" fill="#FFFFFF" rx="1" />
              <rect x="20" y="9" width="12" height="6" fill="#FFFFFF" rx="1" />
              {/* Building base */}
              <rect x="5" y="22" width="42" height="28" fill="#FFFFFF" stroke="#15805D" strokeWidth="1" />
              {/* Clinic text banner */}
              <rect x="2" y="23" width="48" height="10" fill="#E6F7F0" rx="1" />
              <text x="26" y="28" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#0E6146" fontFamily="sans-serif">PUSKESMAS</text>
              <text x="26" y="32" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#0E6146" fontFamily="sans-serif">KURANJI</text>
              {/* Windows & Door */}
              <rect x="9" y="36" width="7" height="9" fill="#38BDF8" rx="0.5" />
              <rect x="36" y="36" width="7" height="9" fill="#38BDF8" rx="0.5" />
              <rect x="22" y="35" width="8" height="15" fill="#15805D" rx="0.5" />
            </g>

            {/* Foliage & Golden Flowers */}
            <g>
              {/* Left foliage */}
              <path d="M 28 110 C 22 96 32 88 42 98 C 42 108 34 114 28 110 Z" fill="#15805D" />
              <path d="M 44 115 C 38 102 48 94 56 104 C 54 114 48 118 44 115 Z" fill="#1B9A72" />
              {/* Yellow blossom */}
              <circle cx="26" cy="94" r="5" fill="#F59E0B" />
              <circle cx="22" cy="88" r="4" fill="#FBBF24" />
              <circle cx="32" cy="88" r="4.5" fill="#F59E0B" />

              {/* Right foliage */}
              <path d="M 172 110 C 178 96 168 88 158 98 C 158 108 166 114 172 110 Z" fill="#15805D" />
              <path d="M 156 115 C 162 102 152 94 144 104 C 146 114 152 118 156 115 Z" fill="#1B9A72" />
            </g>

            {/* Pregnant Mother Illustration */}
            <g transform="translate(0, -2)">
              {/* Back Hair */}
              <path
                d="M 68 70 C 65 35 135 35 132 70 C 138 95 140 120 126 128 C 114 135 86 135 74 128 C 60 120 62 95 68 70 Z"
                fill="url(#hairGrad)"
              />

              {/* Neck & Face */}
              <rect x="94" y="66" width="12" height="12" fill="#FED7AA" rx="4" />
              <ellipse cx="100" cy="56" rx="16" ry="17" fill="#FFEDD5" />

              {/* Front Hair bangs & waves */}
              <path
                d="M 84 52 C 88 40 112 40 116 52 C 116 52 108 45 100 45 C 92 45 84 52 84 52 Z"
                fill="url(#hairGrad)"
              />
              <path
                d="M 84 52 C 82 62 82 72 88 78 C 89 74 88 64 88 56 Z"
                fill="url(#hairGrad)"
              />
              <path
                d="M 116 52 C 118 62 118 72 112 78 C 111 74 112 64 112 56 Z"
                fill="url(#hairGrad)"
              />

              {/* Peaceful smiling face */}
              {/* Eyes closed gently */}
              <path d="M 91 55 Q 94 59 97 55" stroke="#4A261A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 103 55 Q 106 59 109 55" stroke="#4A261A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="89" cy="59" r="3.2" fill="#F472B6" opacity="0.65" />
              <circle cx="111" cy="59" r="3.2" fill="#F472B6" opacity="0.65" />
              {/* Sweet smile */}
              <path d="M 97 63 Q 100 66 103 63" stroke="#E11D48" strokeWidth="1.6" fill="none" strokeLinecap="round" />

              {/* Pregnant Body & Maternity Dress */}
              <path
                d="M 86 76 C 80 84 72 98 70 122 C 78 126 122 126 130 122 C 128 98 120 84 114 76 Z"
                fill="url(#dressGrad)"
              />

              {/* Big round baby bump */}
              <ellipse cx="100" cy="104" rx="24" ry="21" fill="#F472B6" />

              {/* Arms lovingly cradling the belly */}
              {/* Left arm */}
              <path
                d="M 74 86 Q 78 104 90 108"
                stroke="#FFEDD5"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right arm & hand holding belly */}
              <path
                d="M 126 86 Q 122 108 106 112"
                stroke="#FFEDD5"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Gentle hand on belly */}
              <ellipse cx="98" cy="109" rx="7" ry="4" fill="#FFEDD5" transform="rotate(-10 98 109)" />
            </g>

            {/* Bottom Banner Typography Area */}
            {/* White/light background pill under text for pop */}
            <path
              d="M 24 148 C 45 136 155 136 176 148 C 178 178 152 188 100 188 C 48 188 22 178 24 148 Z"
              fill="#FFFFFF"
              opacity="0.92"
            />

            {/* Text: INGEK (Pink bubbly font) */}
            <text
              x="100"
              y="156"
              textAnchor="middle"
              fontFamily="'Fredoka', 'Quicksand', sans-serif"
              fontWeight="900"
              fontSize="23"
              letterSpacing="1.2"
              fill="#E62E76"
              filter="url(#shadow)"
            >
              INGEK
            </text>

            {/* Text: BUNDO (Emerald green font with heart inside O) */}
            <g transform="translate(100, 175)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fontFamily="'Fredoka', 'Quicksand', sans-serif"
                fontWeight="900"
                fontSize="21"
                letterSpacing="1.2"
                fill="#15805D"
              >
                BUNDO
              </text>
              {/* White heart in the O of BUNDO */}
              <path
                d="M 28 -8 C 26 -11 22 -11 21 -8 C 20 -11 16 -11 14 -8 C 14 -5 21 -2 21 -2 C 21 -2 28 -5 28 -8 Z"
                fill="#FFFFFF"
                transform="translate(8, 2) scale(0.65)"
              />
            </g>

            {/* Cute bottom pink accent heart & lines */}
            <line x1="72" y1="181" x2="92" y2="181" stroke="#E62E76" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M 100 180 C 98 178 95 178 94 180 C 93 182 96 185 100 188 C 104 185 107 182 106 180 C 105 178 102 178 100 180 Z"
              fill="#E62E76"
            />
            <line x1="108" y1="181" x2="128" y2="181" stroke="#E62E76" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {allowUpload && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 select-none">
            <Camera size={18} className="drop-shadow-sm" />
            <span className="text-[9px] font-extrabold text-center leading-tight mt-0.5 drop-shadow-sm">
              Ganti Logo
            </span>
          </div>
        )}

        {allowUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        )}
      </div>

      {showSubtitle && (
        <div>
          <div className="flex items-center gap-1.5 font-heading text-2xl font-bold tracking-tight leading-none">
            <span className="text-[#E62E76]">INGEK</span>
            <span className="text-[#15805D]">BUNDO</span>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Puskesmas Kuranji · Kelas Ibu Hamil
          </p>
        </div>
      )}
    </div>
  );
};
