import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-surface text-primary",
    success: "bg-success text-white",
    error: "bg-error text-white",
    warning: "bg-warning text-black",
    accent: "bg-accent text-white",
    sale: "bg-accent text-white font-bold"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;