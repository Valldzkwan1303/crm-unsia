import { useEffect, useState } from 'react';
import { Clock, User as UserIcon, Loader2, Database } from 'lucide-react';
import api from '../../api/axios';

interface Log {
  id: number;
  action: string;
  module: string;
  details: string;
  created_at: string;
  user?: { name: string };
}

const AuditPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        setLogs(res.data.data);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
        <p className="text-slate-400 text-sm">Rekam jejak aktivitas seluruh pengguna sistem secara real-time.</p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
        {loading ? (
          <div className="p-20 flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0f172a] text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-5">Waktu Kejadian</th>
                  <th className="p-5">Pengguna</th>
                  <th className="p-5">Aksi</th>
                  <th className="p-5">Modul</th>
                  <th className="p-5">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-500 italic font-medium">
                      Belum ada catatan aktivitas yang terekam di sistem.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-5 text-slate-500 flex items-center gap-2 whitespace-nowrap">
                        <Clock size={14} className="text-slate-600"/> 
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="p-5 font-bold text-white flex items-center gap-2">
                        <UserIcon size={14} className="text-blue-500"/> 
                        {log.user?.name || 'System'}
                      </td>
                      <td className="p-5">
                        <span className="px-2.5 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-5 text-slate-300 font-bold italic flex items-center gap-2">
                        <Database size={12} className="text-slate-500"/> 
                        {log.module}
                      </td>
                      <td className="p-5 text-slate-400 max-w-md truncate font-medium">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;