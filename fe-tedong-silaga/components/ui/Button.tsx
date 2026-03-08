"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "predictA" | "predictB";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-accent-primary hover:bg-accent-hover text-white shadow-glow",
  secondary: "bg-bg-surface-raised hover:bg-bg-surface-overlay text-text-primary border border-border-default hover:border-border-hover",
  ghost: "bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary border border-transparent",
  gold: "bg-toraja-gold hover:bg-toraja-gold-dim text-bg-base font-bold shadow-gold",
  predictA: "bg-predict-a hover:bg-predict-a-hover text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  predictB: "bg-predict-b hover:bg-predict-b-hover text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base md:text-lg",
  xl: "px-8 py-4 text-lg md:text-xl font-bold",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium",
          "cursor-pointer select-none outline-none",
          "transition-all duration-200",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
