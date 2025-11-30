import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.4)" }}
      className="relative overflow-hidden bg-dark-800/50 backdrop-blur-md border border-dark-700 p-6 rounded-2xl group"
    >
      {/* Backg Effect */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${color}`} />
      
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-1 tracking-wider uppercase">{title}</h3>
          <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        </div>
        <div className={`p-3 rounded-xl bg-dark-900/50 text-2xl ${color.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>

      <motion.div 
        className={`h-1 mt-4 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: "40%" }}
        transition={{ duration: 1, delay: delay + 0.5 }}
      />
    </motion.div>
  );
};

export default StatCard;