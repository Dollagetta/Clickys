import React from 'react';

const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div 
      className={`shimmer-bg rounded-md ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
