import { steps } from '../../data/dummyData';
import type { Step } from '../../types/landing';

export default function StepSectionAgent() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step: Step) => (
            <div key={step.id} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                <div className="mb-6">{step.icon}</div>
                <h3 className="font-black text-[#002855] text-lg">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}