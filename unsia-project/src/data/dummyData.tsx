import { Users, GraduationCap, DollarSign, Link as LinkIcon, BarChart } from 'lucide-react';
import type { Feature, ReasonToChoose, Step, PortfolioItem } from '../types/landing';

export const steps: Step[] = [
  { id: 1, stepNumber: "01", title: "Pendaftaran", description: "Isi formulir melalui portal resmi.", icon: <Users className="w-10 h-10 text-blue-500" /> },
  { id: 2, stepNumber: "02", title: "Verifikasi", description: "Lengkapi profil agen Anda.", icon: <GraduationCap className="w-10 h-10 text-blue-500" /> },
  { id: 3, stepNumber: "03", title: "Struktur Komisi", description: "Sistem mengatur komisi.", icon: <DollarSign className="w-10 h-10 text-blue-500" /> },
  { id: 4, stepNumber: "04", title: "Link Affiliate", description: "Dapatkan tautan unik.", icon: <LinkIcon className="w-10 h-10 text-blue-500" /> },
  { id: 5, stepNumber: "05", title: "Cairkan Cuan", description: "Tarik komisi ke bank.", icon: <BarChart className="w-10 h-10 text-blue-500" /> }
];

export const features: Feature[] = [];
export const reasons: ReasonToChoose[] = [];
export const portfolioItems: PortfolioItem[] = [];