import { cn } from "@/lib/utils";

interface StatusSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusSpinner({ size = "md", className }: StatusSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      
      {/* Inner pulsing dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
      </div>
    </div>
  );
}
