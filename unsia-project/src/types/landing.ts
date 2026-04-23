import type { ReactNode } from 'react';

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Step {
  id: number;
  stepNumber: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export interface ReasonToChoose {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}