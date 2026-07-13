import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Card({
  children,
  className = '',
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-dispatch-line bg-dispatch-panel ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-dispatch-dim mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg bg-dispatch-panel2 border ${
          error ? 'border-dispatch-danger' : 'border-dispatch-line'
        } px-3.5 py-2.5 text-sm text-dispatch-text placeholder:text-dispatch-dim/60 outline-none focus:border-dispatch-accent transition-colors ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-dispatch-danger">{error}</p>}
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-5 h-5 border-2 border-dispatch-line border-t-dispatch-accent rounded-full animate-spin ${className}`}
    />
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-dispatch-panel2 ${className}`} />;
}
