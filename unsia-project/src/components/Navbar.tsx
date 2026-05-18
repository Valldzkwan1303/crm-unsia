import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ['beranda', 'keunggulan', 'program', 'berita', 'konsultasi'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda', id: 'beranda' },
    { name: 'Keunggulan', href: '#keunggulan', id: 'keunggulan' },
    { name: 'Program', href: '#program', id: 'program' },
    { name: 'Berita', href: '#berita', id: 'berita' },
    { name: 'Konsultasi', href: '#konsultasi', id: 'konsultasi' },
  ];

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      isScrolled
        ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/60 py-3 border-b border-slate-100'
        : 'bg-white/70 backdrop-blur-sm py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/src/assets/logounsia.png" alt="Logo UNSIA" className="h-10 object-contain drop-shadow-sm" />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl group ${
                activeSection === link.id
                  ? 'text-[#002855]'
                  : 'text-slate-500 hover:text-[#002855]'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#002855] rounded-full transition-all duration-300 ${
                activeSection === link.id ? 'w-4/5' : 'w-0 group-hover:w-3/5'
              }`} />
            </button>
          ))}
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#002855] font-black text-[10px] uppercase tracking-widest hover:border-[#002855]/30 hover:bg-slate-50 transition-all"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate('/join')}
            className="px-6 py-2.5 bg-[#002855] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            Daftar Sekarang <ChevronRight size={13} />
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className={`text-left py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                activeSection === link.id
                  ? 'bg-blue-50 text-[#002855]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#002855]'
              }`}
            >
              {link.name}
            </button>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-2">
            <button onClick={() => navigate('/login')} className="w-full py-3.5 border border-slate-200 text-[#002855] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">Masuk</button>
            <button onClick={() => navigate('/join')} className="w-full py-3.5 bg-[#002855] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-900/20">Daftar Sekarang</button>
          </div>
        </div>
      </div>
    </nav>
  );
}