// components/CallToAction.js
"use client"; // This component uses Framer Motion for hover/tap animations

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi'; // Default icon example

// Reusable Call To Action button component
const CallToAction = ({
  text = "Learn More", // Default button text
  link = "#",           // Default link
  type = 'primary',     // Corresponds to .btn-primary, .btn-secondary in globals.css
  className = '',       // For additional custom styling from parent
  style = {},           // Inline styles
  aosData = {},         // For AOS scroll animations e.g., { "data-aos": "fade-up" }
  icon,                 // Optional: Pass an icon component e.g. <FiZap />
  iconPosition = 'right',// 'left' or 'right' for the icon
  target = '_self',     // '_self' or '_blank' for link target
  rel = "",
  onClick,
  premium = false,      // New: Adds extra high-end flair
}) => {
  // Construct button classes from global styles and any custom classes
  const buttonClasses = `btn btn-${type} ${className} relative overflow-hidden group transition-all duration-300`;

  // Determine rel attribute, especially for external links
  const linkRel = target === '_blank' ? (rel || 'noopener noreferrer') : rel;

  // Prepare the icon if provided, or use a default
  const buttonIcon = iconPosition === 'right'
    ? icon || <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
    : icon;

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2">
      {buttonIcon && iconPosition === 'left' && (
        <span className="inline-flex items-center transition-transform duration-300 group-hover:-translate-x-1">
          {buttonIcon}
        </span>
      )}
      <span className="whitespace-nowrap">{text}</span>
      {buttonIcon && iconPosition === 'right' && (
        <span className="inline-flex items-center transition-transform duration-300 group-hover:translate-x-1">
          {buttonIcon}
        </span>
      )}
    </span>
  );

  // Shimmer component for premium feel
  const Shimmer = () => (
    <motion.div
      className={`absolute top-0 -left-[100%] ${premium ? 'w-[70%]' : 'w-[50%]'} h-full bg-gradient-to-r from-transparent via-white/${premium ? '40' : '30'} to-transparent skew-x-[-25deg] z-0`}
      animate={{
        left: ["120%", "-120%"],
      }}
      transition={{
        duration: premium ? 1.5 : 2,
        repeat: Infinity,
        repeatDelay: premium ? 2 : 3,
        ease: "linear",
      }}
    />
  );

  const motionProps = {
    whileHover: { 
      scale: premium ? 1.1 : 1.05, 
      y: -4, 
      boxShadow: premium 
        ? "0 25px 50px -12px rgba(22, 163, 74, 0.5), 0 0 15px rgba(22, 163, 74, 0.3)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
    },
    whileTap: { scale: 0.96, y: 0 },
    animate: premium ? {
      boxShadow: [
        "0 0 0px rgba(22, 163, 74, 0)",
        "0 0 20px rgba(22, 163, 74, 0.2)",
        "0 0 0px rgba(22, 163, 74, 0)"
      ]
    } : {},
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: premium ? 8 : 10,
      boxShadow: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    className: `${buttonClasses} ${premium ? 'ring-2 ring-green-400 ring-offset-2' : ''}`,
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }
  };

  // If an onClick handler is provided or type is submit, render as a button
  if (onClick || type === 'submit') {
    return (
      <motion.button
        {...motionProps}
        type={type === 'submit' ? 'submit' : 'button'}
        onClick={onClick}
        {...aosData}
      >
        <Shimmer />
        {content}
      </motion.button>
    );
  }

  // Otherwise, render as a Link (wrapped in motion.a for animation)
  return (
      <motion.a
        {...motionProps}
        target={target}
        rel={linkRel}
        href={link}
        {...aosData}
      >
        <Shimmer />
        {content}
      </motion.a>
  );
};

export default CallToAction;

