"use client";
import { useEffect, useState } from "react";

/**
 * Hero person. Drop a transparent PNG at frontend/public/hero-person.png and it replaces the
 * illustration automatically (a cut-out of a person from the waist up works best).
 */
export default function Person() {
  const [photo, setPhoto] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setPhoto(true);
    img.src = "/hero-person.png";
  }, []);

  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/hero-person.png" alt="" className="h-full w-auto max-w-none object-contain object-bottom" />;
  }

  return (
    <svg viewBox="0 0 320 420" className="h-full w-auto" role="img" aria-label="Illustration of a smiling business owner">
      {/* sweater */}
      <path d="M14 420c0-84 54-122 110-134h72c56 12 110 50 110 134z" fill="#d9cdb3" />
      <path d="M124 286l36 46 36-46c-10-8-22-12-36-12s-26 4-36 12z" fill="#c7b999" />
      {/* neck */}
      <path d="M136 232h48v52c-8 12-40 12-48 0z" fill="#774629" />
      {/* ears */}
      <ellipse cx="96" cy="170" rx="9" ry="16" fill="#85502f" />
      <ellipse cx="224" cy="170" rx="9" ry="16" fill="#85502f" />
      {/* head */}
      <ellipse cx="160" cy="165" rx="64" ry="78" fill="#8d5a3b" />
      {/* hair */}
      <path d="M95 160c-6-62 34-92 65-92s72 30 65 92c-8-30-30-44-65-44s-57 14-65 44z" fill="#15191a" />
      {/* glasses */}
      <rect x="112" y="152" width="40" height="30" rx="12" fill="none" stroke="#15191a" strokeWidth="4" />
      <rect x="168" y="152" width="40" height="30" rx="12" fill="none" stroke="#15191a" strokeWidth="4" />
      <path d="M152 164h16" stroke="#15191a" strokeWidth="4" />
      {/* eyes */}
      <circle cx="132" cy="167" r="4" fill="#15191a" />
      <circle cx="188" cy="167" r="4" fill="#15191a" />
      {/* brows + smile */}
      <path d="M120 142q12-8 26 0M174 142q12-8 26 0" stroke="#15191a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M138 208q22 20 44 0" stroke="#3b1f10" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M134 196q26 14 52 0" stroke="#6b3d22" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".5" />
    </svg>
  );
}
