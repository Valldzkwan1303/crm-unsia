import LogoUnsia from '../assets/logounsia.png';

export default function FooterAgent() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <img src={LogoUnsia} alt="UNSIA" className="h-8 w-auto object-contain" />
            <div className="leading-none">
              <p className="text-sm font-black text-[#002855]">UNSIA</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                Marketing Partner Portal
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] text-center sm:text-right">
            © {new Date().getFullYear()} Universitas Siber Asia — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}