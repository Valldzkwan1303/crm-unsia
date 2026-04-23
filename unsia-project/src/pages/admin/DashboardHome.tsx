import { useEffect, useState } from 'react';
import { 
  Users, UserCheck, DollarSign, TrendingUp, BarChart3, Loader2, 
  PieChart as PieIcon, Target, Share2, Trophy 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '../../api/axios';
import { Card } from '../../components/Card';

const DashboardHome = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#002855', '#3B82F6', '#25D366', '#E1306C', '#8B5CF6', '#F59E0B'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (e) { 
        console.error("Fetch error:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const { stats, source_data, channel_data, agent_performance } = data;

  const statCards = [
    { label: 'Total Prospek', value: stats.total_leads, icon: <Users />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Mitra Aktif', value: stats.active_agents, icon: <TrendingUp />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'Closing Rate', value: `${stats.closing_rate}%`, icon: <UserCheck />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Total Komisi', value: formatRupiah(stats.total_commission), icon: <DollarSign />, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  const collectiveTarget = 50;
  const progressPercent = Math.min(Math.round((stats.total_leads / collectiveTarget) * 100), 100);

  // FIX: CSS Variable untuk linter Edge Tools
  const dynamicProgressStyle = { '--p-width': `${progressPercent}%` } as React.CSSProperties;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-all">
            <div className={`p-3 w-fit ${card.bg} ${card.color} rounded-2xl mb-4`}>{card.icon}</div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
            <h3 className="text-2xl font-black text-[#002855] mt-1">{card.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART 1: SUMBER SOSMED */}
        <Card className="p-8 border-none shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Share2 size={18}/></div>
            <h4 className="font-black text-[#002855] uppercase text-sm tracking-tight">Sumber Sosmed</h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={source_data} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {source_data.map((_:any, index:number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 2: KONTRIBUSI MITRA */}
        <Card className="p-8 border-none shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><PieIcon size={18}/></div>
            <h4 className="font-black text-[#002855] uppercase text-sm tracking-tight">Kontribusi Mitra</h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agent_performance} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {agent_performance.map((_:any, index:number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TARGET & LEADERBOARD */}
        <div className="space-y-8 flex flex-col">
            <Card className="p-8 border-none shadow-sm flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Target size={20}/></div>
                    <h4 className="font-black text-[#002855] uppercase text-sm tracking-tight">Target Kolektif</h4>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end text-sm">
                        <span className="font-bold text-gray-400">Progress</span>
                        <span className="font-black text-blue-600">{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000 w-[var(--p-width)]"
                          style={dynamicProgressStyle}
                        ></div>
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-[#002855] text-white">
                <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-400" size={18} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Top 3 Perekrut</h4>
                </div>
                <div className="space-y-3">
                    {agent_performance.slice(0, 3).map((agent: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                            <span className="text-[10px] font-bold truncate max-w-[120px]">{agent.name}</span>
                            <span className="text-[10px] font-black bg-blue-500 px-2 py-0.5 rounded-full">{agent.value} Maba</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>

      {/* BAR CHART: KANAL PERFORMA */}
      <Card className="p-10 border-none shadow-sm">
        <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={20}/></div>
            <h4 className="font-black text-[#002855] uppercase tracking-tight">Detail Performa Kanal Pendaftaran</h4>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channel_data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
              <Bar dataKey="leads" fill="#3B82F6" radius={[10, 10, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;