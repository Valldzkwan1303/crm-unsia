import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import HeroSection from "../../sections/general/HeroSection";
import AdvantageSection from "../../sections/general/AdvantageSection";
import ProgramsSection from "../../sections/general/ProgramsSection";
import RegistrationSteps from "../../sections/general/RegistrationSteps";
import NewsSection from "../../sections/general/NewsSection";
import SupportSection from "../../sections/general/SupportSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AdvantageSection />
      <ProgramsSection />
      <RegistrationSteps />
      <NewsSection />
      <SupportSection />
      <Footer />
    </div>
  );
}