export default function SkeletonTable() {
  return (
    <div className="p-8 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              <div className="h-3 bg-slate-50 rounded w-1/3"></div>
            </div>
          </div>
          <div className="w-24 h-8 bg-slate-100 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}