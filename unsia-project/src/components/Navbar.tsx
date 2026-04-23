import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Keunggulan', href: '#advantage' },
    { name: 'Program', href: '#programs' },
    { name: 'Berita', href: '#news' },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#002855] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">U</div>
          <span className={`font-black text-xl tracking-tighter transition-colors ${isScrolled ? 'text-[#002855]' : 'text-white'}`}>UNSIA <span className="text-blue-500">MARK</span></span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={`text-xs font-black uppercase tracking-widest transition-all hover:text-blue-500 ${isScrolled ? 'text-slate-600' : 'text-white/80'}`}>
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            Portal Login <ChevronRight size={14} />
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-blue-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
           {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black text-[#002855] uppercase tracking-widest border-b border-slate-50 pb-2">
              {link.name}
            </a>
          ))}
          <button onClick={() => navigate('/login')} className="w-full py-4 bg-[#002855] text-white rounded-2xl font-black uppercase text-xs">Masuk Portal</button>
        </div>
      )}
    </nav>
  );
}