import { useEffect, useState, useMemo } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaSitemap, FaSearch, FaUserTie, FaBuilding } from 'react-icons/fa';

// --- 1. The Recursive Node (Premium Row) ---
const OrgNode = ({ employee, allEmployees, level = 0, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(true); 
  
  // Find children
  const directReports = allEmployees.filter(e => e.manager === employee.name);
  const hasChildren = directReports.length > 0;

  // Search Logic
  const isMatch = useMemo(() => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(lowerTerm) ||
      employee.department.toLowerCase().includes(lowerTerm) ||
      employee.designation.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, employee]);

  const isDimmed = searchTerm && !isMatch;

  useEffect(() => {
    if (searchTerm) setIsOpen(true);
  }, [searchTerm]);

  return (
    <div className="relative">
      
      {/* Employee Card Row */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isDimmed ? 0.3 : 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 group"
      >
        <div 
          className={`
            flex items-center gap-4 p-3 mb-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer
            ${isMatch && searchTerm ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : ''}
            ${!searchTerm && hasChildren ? 'bg-slate-800/60 border-l-[3px] border-l-indigo-500 border-y-slate-700/50 border-r-slate-700/50' : 'bg-slate-900/40 border border-slate-800 hover:bg-slate-800'}
          `}
          style={{ marginLeft: `${level === 0 ? 0 : 28}px` }} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Connector Line*/}
          {level > 0 && (
            <div className="absolute -left-[28px] top-1/2 w-[28px] h-[1px] bg-slate-700">
               <div className="absolute -left-1 top-[-2px] w-[5px] h-[5px] rounded-full bg-slate-600"></div>
            </div>
          )}

          
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2
            ${hasChildren ? 'bg-gradient-to-br from-indigo-600 to-blue-500 ring-indigo-500/30' : 'bg-slate-700 ring-slate-600'}
          `}>
            {employee.name.charAt(0)}
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold tracking-tight ${isMatch && searchTerm ? 'text-indigo-300' : 'text-slate-200'}`}>
                {employee.name}
              </h3>
              {/* Department Badge */}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600">
                {employee.department}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{employee.designation}</p>
          </div>

          {/* Expand/Collapse Toggle & Counts */}
          {hasChildren && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold">{directReports.length}</p>
                <p className="text-[9px] text-slate-600 uppercase">Reports</p>
              </div>
              <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                <FaChevronDown size={10} />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recursive Children Container */}
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden"
          >
            {/* The Vertical Circuit Line */}
            <div 
              className="absolute w-[1px] bg-slate-700 h-[calc(100%-24px)]" 
              style={{ left: `${level === 0 ? 20 : 48}px`, top: '-10px' }}
            ></div>

            <div className="flex flex-col">
              {directReports.map(child => (
                <OrgNode 
                  key={child.id} 
                  employee={child} 
                  allEmployees={allEmployees} 
                  level={level + 1} 
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 2. Main OrgChart Page ---
const OrgChart = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/employees').then(res => {
      setEmployees(res.data);
      setLoading(false);
    });
  }, []);

  // Root Calculation
  const rootEmployees = employees.filter(
    e => !e.manager || e.manager === "Board" || e.manager === "null" || e.manager === "Board Committee"
  );

  return (
    <div className="p-8 min-h-screen bg-[#0f172a] font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
             <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/20"><FaSitemap /></span>
             Organization Structure
          </h1>
          <p className="text-slate-400 text-sm mt-2 ml-1">
             Visualize reporting lines and department hierarchy.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-3 text-slate-500" size={12} />
          <input 
            type="text" 
            placeholder="Find by name, role or dept..." 
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Stats Bar */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold">Total Depth</p>
              <p className="text-lg font-bold text-white">4 Levels</p>
           </div>
           <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold">Leaders</p>
              <p className="text-lg font-bold text-indigo-400">{rootEmployees.length}</p>
           </div>
           <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold">Departments</p>
              <p className="text-lg font-bold text-emerald-400">5 Active</p>
           </div>
           <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold">Headcount</p>
              <p className="text-lg font-bold text-slate-200">{employees.length}</p>
           </div>
        </div>
      )}

      {/* 3. Tree Container */}
      <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-slate-800 shadow-2xl relative min-h-[500px]">
        {loading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <FaSitemap className="text-4xl mb-4 opacity-20 animate-pulse" />
              <p className="text-xs tracking-widest uppercase">Mapping Hierarchy...</p>
           </div>
        ) : (
          <div className="max-w-4xl">
             {rootEmployees.map(root => (
               <OrgNode 
                 key={root.id} 
                 employee={root} 
                 allEmployees={employees} 
                 level={0} 
                 searchTerm={search}
               />
             ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default OrgChart;