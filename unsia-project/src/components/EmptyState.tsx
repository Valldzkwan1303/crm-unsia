import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-inner">
        <Inbox size={48} />
      </div>
      <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm mt-2 max-w-xs font-medium italic">{message}</p>
    </div>
  );
};

export default EmptyState;