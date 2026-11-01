import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

type Opt = { value: string; label: React.ReactNode; disabled?: boolean };

export function Select({
  value, onChange, children, className = '', disabled, id, name, title,
  'aria-label': ariaLabel,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 160, maxHeight: 288 });
  const btn = useRef<HTMLButtonElement>(null);
  const listbox = useRef<HTMLDivElement>(null);

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
    const handleScroll = (event: Event) => {
      if (listbox.current?.contains(event.target as Node)) return;
      close();
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('resize', close);
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    const r = btn.current?.getBoundingClientRect();
    if (r) {
      const viewportPadding = 8;
      const gap = 4;
      const width = Math.min(Math.max(r.width, 140), window.innerWidth - viewportPadding * 2);
      const desiredHeight = Math.min(288, options.length * 36 + 8);
      const availableBelow = Math.max(0, window.innerHeight - r.bottom - gap - viewportPadding);
      const availableAbove = Math.max(0, r.top - gap - viewportPadding);
      const placeBelow = availableBelow >= desiredHeight || availableBelow >= availableAbove;
      const maxHeight = Math.max(80, Math.min(desiredHeight, placeBelow ? availableBelow : availableAbove));
      const left = Math.min(Math.max(viewportPadding, r.left), window.innerWidth - width - viewportPadding);
      const top = placeBelow
        ? Math.min(r.bottom + gap, window.innerHeight - viewportPadding - maxHeight)
        : Math.max(viewportPadding, r.top - gap - maxHeight);
      setPos({ top, left, width, maxHeight });
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
            ref={listbox}
            role="listbox"
            className="select-options fixed z-[101] bg-surface border border-border rounded-xl shadow-2xl overflow-y-auto overscroll-contain py-1"
            style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
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