import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

import NavbarAgent from '../../layouts/NavbarAgent';
import FooterAgent from '../../layouts/FooterAgent';
import HeroSectionAgent from '../../sections/agent/HeroSectionAgent';
import BenefitSectionAgent from '../../sections/agent/BenefitSectionAgent';
import UnsiaSectionAgent from '../../sections/agent/UnsiaSectionAgent';
import StepSectionAgent from '../../sections/agent/StepSectionAgent';
import PortfolioSectionAgent from '../../sections/agent/PortfolioSectionAgent';
import CtaSectionAgent from '../../sections/agent/CtaSectionAgent';

export default function LandingPageAgent() {
  const { agentCode } = useParams(); 
  const [searchParams] = useSearchParams();
  
  // TANGKAP SUMBER DARI URL (Misal: ?src=tiktok)
  const source = searchParams.get('src') || 'direct'; 

  const [agentName, setAgentName] = useState('Partner Resmi');

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const res = await api.get(`/public/agent/${agentCode}`);
        setAgentName(res.data.name);
      } catch (error) {
        console.error("Agent tidak valid");
      }
    };
    if (agentCode && agentCode !== 'N/A') fetchAgentInfo();
  }, [agentCode]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* OPER 'source' KE NAVBAR */}
      <NavbarAgent agentName={agentName} agentCode={agentCode} source={source} />
      
      {/* OPER 'source' KE HERO */}
      <HeroSectionAgent 
        agentCode={agentCode} 
        agentName={agentName} 
        source={source} 
      />
      
      <UnsiaSectionAgent />
      <BenefitSectionAgent />
      <StepSectionAgent />
      <PortfolioSectionAgent />
      
      <CtaSectionAgent agentCode={agentCode} source={source} />
      
      <FooterAgent />
    </div>
  );
}