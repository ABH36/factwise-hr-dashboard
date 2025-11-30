import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaSitemap, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: <FaHome /> },
    { path: '/employees', label: 'Workforce', icon: <FaUsers /> },
    { path: '/org-chart', label: 'Hierarchy', icon: <FaSitemap /> },
  ];

  // Sidebar Content Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">FactWise</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-widest mt-0.5">HR ANALYTICS</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
          <FaTimes size={24} />
        </button>
      </div>

      {/* 2. Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => window.innerWidth < 768 && toggleSidebar()} // Close on click (Mobile)
              className="relative block group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-indigo-600/10 rounded-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                />
              )}
              <div className={`
                relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-200 group-hover:bg-slate-800/50'}
              `}>
                <span className={`text-lg ${isActive ? 'text-indigo-400' : ''}`}>{item.icon}</span>
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer Profile */}
      <div className="p-4 m-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="w-9 h-9 rounded-full bg-slate-700" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Admin User</p>
          <p className="text-[10px] text-slate-500 truncate">admin@factwise.io</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed top-0 left-0 z-40 flex-col">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Sidebar Slide-in */}
            <motion.aside 
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-screen z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;