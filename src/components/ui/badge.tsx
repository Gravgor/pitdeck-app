import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gray-800 text-white hover:bg-gray-700",
        secondary:
          "bg-gray-800/30 text-gray-300 backdrop-blur-sm border border-gray-700",
        destructive:
          "bg-red-500/20 text-red-400 hover:bg-red-500/30",
        outline:
          "border border-white/20 text-white hover:bg-white/5",
        success:
          "bg-green-500/20 text-green-400 hover:bg-green-500/30",
        warning:
          "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30",
        premium:
          "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-400 border border-yellow-500/20",
        level: 
          "bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 border border-blue-500/20",
        rare:
          "bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-purple-400 border border-purple-500/20",
        legendary:
          "bg-gradient-to-r from-orange-600/20 to-yellow-400/20 text-yellow-400 border border-yellow-500/20",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 