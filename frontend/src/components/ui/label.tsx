import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, requiredIndicator = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-slate-100', className)}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {requiredIndicator && (
          <span className="text-xs font-semibold uppercase tracking-wide text-red-400">
            *
          </span>
        )}
      </span>
    </label>
  ),
)
Label.displayName = 'Label'

export { Label }
