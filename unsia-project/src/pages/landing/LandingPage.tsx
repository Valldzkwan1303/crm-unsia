import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import HeroSection from "../../sections/general/HeroSection";
import AdvantageSection from "../../sections/general/AdvantageSection";
import ProgramsSection from "../../sections/general/ProgramsSection";
import PersyaratanSection from "../../sections/general/PersyaratanSection";
import RegistrationSteps from "../../sections/general/RegistrationSteps";
import NewsSection from "../../sections/general/NewsSection";
import KonsultasiSection from "../../sections/general/KonsultasiSection";
import SupportSection from "../../sections/general/SupportSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AdvantageSection />
      <ProgramsSection />
      <PersyaratanSection />
      <RegistrationSteps />
      <NewsSection />
      <KonsultasiSection />
      <SupportSection />
      <Footer />
    </div>
  );
}