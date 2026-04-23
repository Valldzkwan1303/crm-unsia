import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'white' | 'blue';
  className?: string;
}

export default function Button({ children, variant = 'primary', className = "", ...props }: ButtonProps) {
  const baseStyles = "px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#002855] text-white shadow-xl hover:bg-blue-800",
    outline: "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50",
    white: "bg-white text-[#002855] hover:bg-slate-50",
    blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}