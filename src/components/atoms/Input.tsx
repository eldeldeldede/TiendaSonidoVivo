import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

// Átomo: Campo de texto estandarizado con etiqueta, texto de ayuda y manejo de errores
export const Input: React.FC<InputProps> = ({ label, helperText, error, className = '', id, ...props }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-semibold">
          {label} {helperText && <small className="text-muted">({helperText})</small>}
        </label>
      )}
      <input id={id} className={`form-control ${error ? 'is-invalid' : ''} ${className}`} {...props} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};