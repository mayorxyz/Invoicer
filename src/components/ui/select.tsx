import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

type Opt = { value: string; label: React.ReactNode; disabled?: boolean };

export function Select({
  value, onChange, children, className = '', disabled, id, name, title,
  'aria-label': ariaLabel,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 160 });
  const btn = useRef<HTMLButtonElement>(null);

  const options = useMemo<Opt[]>(
    () =>
      React.Children.toArray(children).flatMap((c: any) =>
        c?.type === 'option'
          ? [{ value: String(c.props.value ?? c.props.children), label: c.props.children, disabled: c.props.disabled }]
          : []
      ),
    [children]
  );
  const current = options.find(o => o.value === String(value ?? ''));

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const key = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('resize', close);
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    const r = btn.current?.getBoundingClientRect();
    if (r) {
      const below = window.innerHeight - r.bottom;
      setPos({ top: below < 260 ? Math.max(8, r.top - 4 - Math.min(288, options.length * 36 + 8)) : r.bottom + 4, left: r.left, width: Math.max(r.width, 140) });
    }
    setOpen(o => !o);
  };

  const pick = (v: string) => {
    const e = { target: { value: v, name }, currentTarget: { value: v, name } } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(e);
    setOpen(false);
    btn.current?.focus();
  };

  const step = (dir: 1 | -1) => {
    const enabled = options.filter(o => !o.disabled);
    const i = enabled.findIndex(o => o.value === String(value ?? ''));
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    if (next) pick(next.value);
  };

  return (
    <>
      <button
        ref={btn}
        id={id}
        type="button"
        title={title}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={e => {
          if (open) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
        }}
        className={`inline-flex items-center justify-between gap-2 min-h-[40px] border border-border rounded-md bg-surface text-foreground px-3 text-sm font-medium text-left cursor-pointer hover:border-[var(--border-strong)] focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className="truncate">{current?.label ?? ''}</span>
        <Icon name="caret-down" size={12} />
      </button>
      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            className="fixed z-[101] bg-surface border border-border rounded-xl shadow-2xl overflow-y-auto py-1 max-h-72"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map(o => {
              const active = o.value === String(value ?? '');
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={o.disabled}
                  onClick={() => pick(o.value)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer disabled:opacity-40 ${
                    active ? 'bg-accent/10 font-semibold text-accent' : 'text-foreground hover:bg-background-subtle'
                  }`}
                >
                  <span>{o.label}</span>
                  {active && <Icon name="check" size={14} color="var(--accent)" />}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </>
  );
}