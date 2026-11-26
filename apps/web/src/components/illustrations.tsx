export function HeroPeople() {
  return (
    <svg viewBox="0 0 360 280" className="w-full max-w-md" aria-hidden>
      <ellipse cx="180" cy="250" rx="140" ry="18" fill="#c8f04d" opacity="0.5" />
      <circle cx="250" cy="70" r="48" fill="#c8f04d" />
      <rect x="70" y="90" width="90" height="110" rx="45" fill="#f5c518" />
      <circle cx="115" cy="70" r="28" fill="#111" />
      <rect x="88" y="118" width="54" height="70" rx="8" fill="#111" opacity="0.12" />
      <circle cx="210" cy="88" r="26" fill="#111" />
      <rect x="168" y="110" width="84" height="100" rx="42" fill="#fffefb" stroke="#111" strokeWidth="3" />
      <path d="M40 200c40-40 80-20 120 0" fill="none" stroke="#111" strokeWidth="3" />
      <circle cx="300" cy="160" r="22" fill="#fffefb" stroke="#111" strokeWidth="3" />
      <path d="M292 160h16M300 152v16" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

export function EmptyPeople() {
  return (
    <svg viewBox="0 0 200 120" className="mx-auto h-24" aria-hidden>
      <circle cx="70" cy="36" r="16" fill="#111" />
      <rect x="50" y="54" width="40" height="46" rx="20" fill="#c8f04d" />
      <circle cx="130" cy="40" r="16" fill="#111" />
      <rect x="110" y="58" width="40" height="44" rx="20" fill="#f5c518" />
    </svg>
  );
}
