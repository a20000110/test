import React from "react";

export default function SubLayout({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <div className={`container lg:py-16 md:py-8 py-6 ${className}`}>
    {children}
  </div>;
}