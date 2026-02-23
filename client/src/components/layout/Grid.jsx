import React from "react";

const Grid = ({ children, className = "" }) => {
  return <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${className}`}>{children}</div>;
};

export default Grid;
