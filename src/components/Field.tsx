import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, optional, error, hint, children, className }: FieldProps) {
  return (
    <div className={`field${className ? ' ' + className : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? <span className="optional"> (optional)</span> : null}
      </label>
      {children}
      {hint && !error ? <span className="field-hint">{hint}</span> : null}
      {error ? (
        <span className="field-error" role="alert">
          ⚠ {error}
        </span>
      ) : null}
    </div>
  );
}

export function inputClass(error?: string): string {
  return error ? 'invalid' : '';
}
