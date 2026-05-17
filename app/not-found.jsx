'use client';

import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiShoppingBag } from 'react-icons/fi';
import AnimatedPageWrapper from '../components/AnimatedPageWrapper';
import CallToAction from '../components/CallToAction';
import styles from '../styles/NotFoundPage.module.css';

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <AnimatedPageWrapper>
      <motion.div
        className={styles.notFoundContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <FiAlertTriangle className={styles.icon} />
        </motion.div>
        <motion.h1 className={styles.title} variants={itemVariants}>
          404 - Page Not Found
        </motion.h1>
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>
        <motion.div className={styles.actions} variants={itemVariants}>
          <CallToAction
            text="Go to Homepage"
            link="/"
            type="primary"
            icon={<FiHome />}
            iconPosition="left"
          />
          <CallToAction
            text="Browse Products"
            link="/products"
            type="outline-dark"
            icon={<FiShoppingBag />}
            iconPosition="left"
          />
        </motion.div>
      </motion.div>
    </AnimatedPageWrapper>
  );
};

export default NotFound;
