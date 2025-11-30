import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa'; 
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import OrgChart from './pages/OrgChart';
import NotFound from './pages/NotFound';

// Animation Config
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/employees" element={<PageWrapper><Employees /></PageWrapper>} />
        <Route path="/org-chart" element={<PageWrapper><OrgChart /></PageWrapper>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
        
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 w-full md:ml-64 transition-all duration-300 flex flex-col h-screen">
          
          {/* Mobile*/}
          <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">F</div>
               <span className="font-bold text-lg">FactWise</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
            >
              <FaBars size={20} />
            </button>
          </div>

          {/* Page Content*/}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
             <AnimatedRoutes />
          </div>
          
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;