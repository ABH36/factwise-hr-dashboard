import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from '../api/axios';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaDownload, FaSyncAlt, FaTrash, FaEdit, FaCircle, FaFilter } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'; 

const Employees = () => {
  const [originalData, setOriginalData] = useState([]); 
  const [rowData, setRowData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [gridApi, setGridApi] = useState(null);
  const [activeTab, setActiveTab] = useState('All'); 

  // 1. Data Fetching
  const fetchEmployees = async (isRefresh = false) => {
    if (isRefresh) setLoading(true);
    try {
      const res = await axios.get('/employees');
      setOriginalData(res.data);
      setRowData(res.data); 
      if (isRefresh) toast.success("Synced with database");
    } catch (err) {
      console.error(err);
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Smart Tabs Logic 
  const filterByTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setRowData(originalData);
    } else if (tab === 'Active') {
      setRowData(originalData.filter(emp => emp.isActive));
    } else if (tab === 'Inactive') {
      setRowData(originalData.filter(emp => !emp.isActive));
    } else if (tab === 'Engineering') {
      setRowData(originalData.filter(emp => emp.department === 'Engineering'));
    }
  };

  // 3. Status Toggle
  const toggleStatus = (id, currentStatus, rowIndex) => {
    const updated = [...rowData];
    updated[rowIndex].isActive = !currentStatus;
    setRowData(updated);

    const masterIndex = originalData.findIndex(e => e.id === id);
    if(masterIndex !== -1) originalData[masterIndex].isActive = !currentStatus;

    toast.success(`Status updated`);
  };

  // 4. Columns
  const colDefs = useMemo(() => [
    { 
      headerName: "EMPLOYEE PROFILE", 
      field: "name", 
      minWidth: 280,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params) => {
        if (!params.value) return null;
        const initials = params.value.split(' ').map(n => n[0]).join('').slice(0, 2);
        return (
          <div className="flex items-center gap-4 h-full group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600 group-hover:border-indigo-500 group-hover:text-white transition-colors">
              {initials}
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-slate-200 text-sm leading-none mb-1 group-hover:text-indigo-400 transition-colors">{params.value}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">{params.data.department}</span>
            </div>
          </div>
        );
      }
    },
    { 
      headerName: "ROLE & POSITION", 
      field: "designation",
      minWidth: 220,
      cellRenderer: params => <span className="text-slate-400 text-sm font-medium">{params.value}</span>
    },
    { 
      headerName: "PERFORMANCE", 
      field: "performanceRating",
      width: 140,
      cellRenderer: params => {
        const val = params.value;
        const color = val >= 4.5 ? 'bg-emerald-500' : val >= 3.5 ? 'bg-amber-500' : 'bg-rose-500';
        return (
          <div className="flex items-center gap-2.5 h-full">
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden max-w-[60px]">
              <div className={`h-full ${color}`} style={{ width: `${(val/5)*100}%` }}></div>
            </div>
            <span className="text-slate-300 text-xs font-bold">{val}</span>
          </div>
        );
      }
    },
    { 
      headerName: "SALARY (CTC)", 
      field: "salary",
      valueFormatter: params => params.value ? `₹${(params.value/100000).toFixed(1)} L` : "-",
      cellStyle: { fontFamily: 'monospace', color: '#94a3b8' }
    },
    { 
      headerName: "STATUS", 
      field: "isActive",
      width: 130,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
           <button 
             onClick={() => toggleStatus(params.data.id, params.value, params.node.rowIndex)}
             className={`
               flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border
               ${params.value 
                 ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10' 
                 : 'bg-slate-700/30 text-slate-400 border-slate-600 hover:bg-slate-700/50'}
             `}
           >
             <FaCircle size={5} className={params.value ? "animate-pulse" : ""} />
             {params.value ? 'Active' : 'Offline'}
           </button>
        </div>
      )
    },
  ], [rowData, originalData]); 

  const defaultColDef = useMemo(() => ({
    sortable: true, filter: true, resizable: true, flex: 1,
    floatingFilter: false, suppressMenu: true,
  }), []);

  return (
    <div className="p-8 h-screen bg-[#0f172a] flex flex-col font-sans overflow-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Directory</h1>
          <p className="text-slate-400 text-xs mt-1">
             Manage access, roles, and performance insights.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={() => gridApi?.exportDataAsCsv()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all">
             <FaDownload size={10} /> CSV
           </button>
           <button onClick={() => fetchEmployees(true)} className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-slate-700 transition-all">
             <FaSyncAlt size={12} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-1">
        {['All', 'Active', 'Inactive', 'Engineering'].map((tab) => (
          <button
            key={tab}
            onClick={() => filterByTab(tab)}
            className={`
              relative px-4 py-2 text-xs font-medium transition-colors
              ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="underline" className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-indigo-500" />
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-600 font-mono">
          Showing {rowData.length} records
        </span>
      </div>

      {/* 3. The Grid */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0f172a] relative">
        {loading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 bg-[#0f172a] z-50">
             <div className="w-8 h-8 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-xs font-medium tracking-wide animate-pulse">SYNCING DATA...</p>
           </div>
        ) : (
          <div className="ag-theme-quartz-dark h-full w-full">
            <style>{`
              .ag-theme-quartz-dark {
                --ag-background-color: #0f172a; /* Deep Dark */
                --ag-header-background-color: #0f172a;
                --ag-row-hover-color: #1e293b;
                --ag-border-color: transparent;
                --ag-row-border-color: #1e293b;
                --ag-header-foreground-color: #64748b;
                --ag-foreground-color: #cbd5e1;
                --ag-row-height: 60px;
                --ag-header-height: 40px;
                --ag-font-size: 13px;
              }
              .ag-header-cell-text { font-weight: 700; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
              .ag-header-cell { border-bottom: 1px solid #1e293b !important; }
            `}</style>
            
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              rowSelection='multiple'
              animateRows={true}
              onGridReady={(params) => setGridApi(params.api)}
              suppressCellFocus={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;