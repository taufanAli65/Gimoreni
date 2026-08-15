import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-forest text-off-white hover:bg-forest/80",
        active:
          "bg-moss-green text-white hover:bg-moss-green/80",
        approved:
          "bg-moss-green text-white hover:bg-moss-green/80",
        pending:
          "bg-warm-beige text-deep-brown hover:bg-warm-beige/80",
        draft:
          "bg-gray-200 text-gray-800 hover:bg-gray-200/80",
        rejected:
          "bg-deep-brown text-white hover:bg-deep-brown/80",
        expired:
          "bg-deep-brown text-white hover:bg-deep-brown/80",
        inactive:
          "bg-gray-400 text-white hover:bg-gray-400/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatusBadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
