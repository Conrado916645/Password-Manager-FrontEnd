import { useEffect, useState } from 'react';
import {  Users, ShieldCheck, Server, Terminal } from 'lucide-react';
import { SystemService } from '../api/services';

// 🚨 Define the shape of your data for type safety
interface DashboardData {
  metrics: {
    total_users: number;
    human_users: number;
    service_accounts: number;
    total_apps: number;
  };
  installed_apps: string[];
  logs: string[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SystemService.getDashboardMetrics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error("Dashboard Load Error:", err));
  }, []);

  if (loading || !data) return (
    <div className="flex h-screen items-center justify-center text-slate-400 animate-pulse font-mono">
      Initializing System Monitor...
    </div>
  );

  const stats = [
    { title: 'Total Users', value: data.metrics.total_users, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Human Users', value: data.metrics.human_users, icon: Users, color: 'from-indigo-500 to-purple-500' },
    { title: 'Service Accounts', value: data.metrics.service_accounts, icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
    { title: 'Total Apps', value: data.metrics.total_apps, icon: Server, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-slate-50 dark:bg-[#0A0F1D] transition-colors duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-2">Real-time health monitoring and audit trail.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`}></div>
            <div className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500 mt-4 uppercase tracking-widest">{stat.title}</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </section>

<section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] overflow-hidden shadow-sm">
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161616]">
    <div className="flex items-center gap-3">
      <Terminal size={16} className="text-emerald-500" />
      <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Live Audit Stream</h2>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
    </div>
  </div>

  {/* 2. Styled Terminal Output */}
  <div className="p-6 font-mono text-[11px] bg-[#050505] overflow-x-auto max-h-[400px] overflow-y-auto">
    {data.logs.map((log, i) => {
      // Logic to color-code based on content
      const isError = log.includes("ERROR") || log.includes("403") || log.includes("422");
      const isWarning = log.includes("WARNING");
      
      return (
        <p key={i} className={`py-1 border-b border-white/5 transition-colors flex gap-3 ${
          isError ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-500/80"
        }`}>
          <span className="opacity-40 shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
          <span className="font-bold shrink-0">{isError ? "[ERR]" : isWarning ? "[WRN]" : "[INF]"}</span>
          <span className="truncate">{log}</span>
        </p>
      );
    })}
  </div>
</section>
    </div>
  );
}