import type { ReactNode } from 'react';

// PERBAIKAN: Gunakan 'export const Card' agar panggilannya pakai { Card } jadi benar
export const Card = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <div className={`bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;