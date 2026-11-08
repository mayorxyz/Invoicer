import React, { useEffect, useRef, useState } from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onChange: (value: number) => void;
}

function display(value: number) {
  return value === 0 ? '' : String(value);
}

export function NumberInput({ value, onChange, onFocus, onBlur, ...props }: NumberInputProps) {
  const [text, setText] = useState(display(value));
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) setText(display(value));
  }, [value]);

  return (
    <input
      {...props}
      type="number"
      value={text}
      onFocus={(e) => {
        focusedRef.current = true;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        focusedRef.current = false;
        setText(display(value));
        onBlur?.(e);
      }}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        const parsed = parseFloat(raw);
        onChange(Number.isNaN(parsed) ? 0 : parsed);
      }}
    />
  );
}
