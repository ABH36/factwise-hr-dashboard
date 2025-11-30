import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  FaUsers, FaWallet, FaChartLine, FaBriefcase, FaArrowUp, FaDownload, FaPlus, FaBell, FaClock 
} from 'react-icons/fa';

// --- Stat Card Component ---
const StatCard = ({ title, value, subValue, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative overflow-hidden bg-[#1e293b] border border-slate-800 p-6 rounded-2xl group hover:border-slate-700 transition-all shadow-lg"
  >
    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity ${color}`} />
    <div className="flex justify-between items-start z-10 relative">
      <div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        {subValue && (
          <p className="text-xs font-medium mt-2 flex items-center gap-1 text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
            <FaArrowUp size={10} /> {subValue}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-slate-800/50 text-xl border border-slate-700 ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recsRes] = await Promise.all([
          axios.get('/employees/stats'),
          axios.get('/employees/recommend')
        ]);
        setStats(statsRes.data);
        setRecs(recsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-500 animate-pulse text-sm font-medium tracking-widest">
      LOADING LIVE DATA...
    </div>
  );

  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Helper to format "Time Ago"
  const timeAgo = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} days ago`;
  };

  return (
    <div className="p-8 min-h-screen bg-[#0f172a] space-y-8 font-sans text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time overview of workforce metrics.</p>
        </motion.div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-all">
            <FaDownload size={12} /> Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
            <FaPlus size={12} /> Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          subValue="+2 joined recently"
          icon={<FaUsers />} 
          color="bg-indigo-500" 
          delay={0.1} 
        />
        <StatCard 
          title="Average Salary" 
          value={`₹${(stats.avgSalary/1000).toFixed(0)}k`} 
          subValue="Monthly CTC"
          icon={<FaWallet />} 
          color="bg-emerald-500" 
          delay={0.2} 
        />
        <StatCard 
          title="Avg Performance" 
          value={stats.avgRating} 
          subValue="Target: 4.0+"
          icon={<FaChartLine />} 
          color="bg-amber-500" 
          delay={0.3} 
        />
        <StatCard 
          title="Projects Completed" 
          value={stats.totalProjects} 
          subValue="Across all teams"
          icon={<FaBriefcase />} 
          color="bg-pink-500" 
          delay={0.4} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full lg:h-[400px]">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Salary Outflow (6 Months)</h3>
            <span className="text-xs text-slate-500">Based on active CTC</span>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salaryTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Payout"]}
                />
                <Area type="monotone" dataKey="amt" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Department Spread</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.deptDist} 
                  cx="50%" cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="count"
                  stroke="none"
                >
                  {stats.deptDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-2xl font-bold text-white block">{stats.totalEmployees}</span>
              <span className="text-[10px] text-slate-500 uppercase">Total Staff</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {stats.deptDist.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                {entry._id}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="text-lg">✨</span> AI Action Items
            </h3>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] rounded border border-indigo-500/20">Live Analysis</span>
          </div>

          <div className="space-y-3">
             {recs.promotion.slice(0, 2).map(emp => (
               <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border-l-2 border-emerald-500 hover:bg-slate-800 transition">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">{emp.name.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">Promote {emp.name}</p>
                      <p className="text-xs text-slate-500">Score: {emp.score.toFixed(0)} • High Performance</p>
                    </div>
                 </div>
                 <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Approve</button>
               </div>
             ))}
             {recs.training.slice(0, 1).map(emp => (
               <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border-l-2 border-rose-500 hover:bg-slate-800 transition">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">{emp.name.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">Training: {emp.name}</p>
                      <p className="text-xs text-slate-500">Rating: {emp.performanceRating} • Needs Improvement</p>
                    </div>
                 </div>
                 <button className="text-xs text-rose-400 hover:text-rose-300 font-medium">Schedule</button>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
               <FaBell className="text-slate-500" /> Recent Onboarding
             </h3>
             <button className="text-indigo-400 text-xs hover:text-indigo-300">View Logs</button>
          </div>
          
          <div className="space-y-4 relative">
             <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-slate-700/50"></div>

             {stats.recentActivity.map((item, i) => (
                <div key={i} className="flex gap-4 items-start relative z-10 group">
                   <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0 group-hover:border-indigo-500 transition-colors">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   </div>
                   <div>
                     <p className="text-sm text-slate-300">
                        <span className="text-white font-medium">{item.name}</span> joined as {item.designation}
                     </p>
                     <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                       <FaClock size={8} /> {timeAgo(item.createdAt)}
                     </p>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;