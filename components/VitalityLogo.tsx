interface VitalityLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export function VitalityLogo({
  className = "h-10 w-auto",
  size,
  showText = false,
}: VitalityLogoProps) {
  const imageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAl23vReDwMnhian1DFuyEp7h005QNY4--VFH8nocqVOSSSl00rL_vp9i2XCECzezkMqx4Ig1fQrOvJASDjdUeWDoPCT7buT0_khnl_Oi8YcrQhdzeYUC0wYhZIpqyhCE4i62kgJoqbaxXfXwtSfriZ4nmOF3o6VmZhnhAwwnrLmWVZcb8vD_G9NHAUTVhws4Wa4H48v-Sxsye-dnwNw-wBSVOmAo-rA_BysmbDjD_mtBgYKuXfKJW0u8Ar_7CThAKilSw";

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      style={size ? { width: size } : undefined}
    >
      <div className="relative flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Vitality Health Insurance"
          referrerPolicy="no-referrer"
          className="h-full w-auto max-h-[80px] object-contain drop-shadow-sm transition-transform hover:scale-105"
          onError={(event) => {
            const image = event.currentTarget;
            image.style.display = "none";

            const fallback = image.nextElementSibling;

            if (fallback instanceof HTMLElement) {
              fallback.style.display = "block";
            }
          }}
        />

        <svg
          className="hidden h-12 w-12"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Vitality Health Insurance logo"
          role="img"
        >
          <ellipse cx="50" cy="18" rx="7" ry="14" fill="#38a169" />

          <ellipse
            cx="32"
            cy="26"
            rx="7"
            ry="13"
            transform="rotate(-35 32 26)"
            fill="#2f855a"
          />

          <ellipse
            cx="68"
            cy="26"
            rx="7"
            ry="13"
            transform="rotate(35 68 26)"
            fill="#2f855a"
          />

          <ellipse
            cx="20"
            cy="42"
            rx="7"
            ry="13"
            transform="rotate(-70 20 42)"
            fill="#38a169"
          />

          <ellipse
            cx="80"
            cy="42"
            rx="7"
            ry="13"
            transform="rotate(70 80 42)"
            fill="#38a169"
          />

          <ellipse
            cx="34"
            cy="60"
            rx="6"
            ry="12"
            transform="rotate(-40 34 60)"
            fill="#2f855a"
          />

          <ellipse
            cx="66"
            cy="60"
            rx="6"
            ry="12"
            transform="rotate(40 66 60)"
            fill="#2f855a"
          />

          <circle cx="50" cy="38" r="7" fill="url(#goldGrad)" />

          <path
            d="M32 44 C44 44 50 56 50 64 C50 74 42 82 50 94 C58 82 50 74 50 64 C50 56 56 44 68 44"
            stroke="url(#goldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M50 58 C42 66 42 78 50 86 C58 78 58 66 50 58 Z"
            fill="url(#goldGrad)"
          />

          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold leading-none tracking-tight text-[#003429]">
            Vitality
          </span>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#735c00]">
            Health Insurance
          </span>
        </div>
      )}
    </div>
  );
}
