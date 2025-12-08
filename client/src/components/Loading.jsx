// components/LoadingScreen.jsx
import { motion, AnimatePresence } from "framer-motion";

const Loading = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
      >
        <motion.div
          className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
