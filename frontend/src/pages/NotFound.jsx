import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4"
      >
        404
      </motion.h1>

      <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Oops! Lagta hai aap kisi aur dimension mein aa gaye hain. 
        Ye page exist nahi karta.
      </p>

      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white text-dark-900 font-bold rounded-xl hover:bg-gray-200 transition shadow-lg shadow-white/10"
        >
          Go Back Home
        </motion.button>
      </Link>
    </div>
  );
};

export default NotFound;