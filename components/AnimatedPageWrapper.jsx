"use client";
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const AnimatedPageWrapper = ({ children, style = {} }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPageWrapper;
