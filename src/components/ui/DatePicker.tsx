import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

const asDate = (value: string) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function DatePicker({ value, onChange, className = '', ariaLabel = 'Choose date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const selected = asDate(value) ?? new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const [position, setPosition] = useState({ top: 0, left: 0, width: 288 });
  const trigger = useRef<HTMLButtonElement>(null);
  const calendar = useRef<HTMLDivElement>(null);
  const selectedDate = asDate(value);
  const today = new Date();

  useEffect(() => {
    if (selectedDate) setMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !calendar.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onScroll = (event: Event) => {
      if (!calendar.current?.contains(event.target as Node)) setOpen(false);
    };
    const onResize = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const openCalendar = () => {
    const bounds = trigger.current?.getBoundingClientRect();
    if (bounds) {
      const width = Math.min(288, window.innerWidth - 16);
      const height = 340;
      const pad = 8;
      const left = Math.min(Math.max(pad, bounds.left), window.innerWidth - width - pad);
      const below = window.innerHeight - bounds.bottom;
      const top = below >= height + 8
        ? bounds.bottom + 4
        : Math.max(pad, bounds.top - height - 4);
      setPosition({ top, left, width });
    }
    setOpen(true);
  };

  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month);
  const selectedLabel = selectedDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(selectedDate)
    : 'Select date';

  const chooseDate = (date: Date) => {
    onChange(dateValue(date));
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label={`${ariaLabel}: ${selectedLabel}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openCalendar}
        className={`inline-flex w-full items-center justify-between gap-2 min-h-[40px] border border-border rounded-md bg-surface text-foreground px-3 text-sm font-medium text-left cursor-pointer hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
      >
        <span className={`truncate font-mono ${selectedDate ? '' : 'text-muted'}`}>{selectedLabel}</span>
        <Icon name="calendar" size={16} className="shrink-0 text-muted" />
      </button>
      {open && createPortal(
        <div
          ref={calendar}
          role="dialog"
          aria-label="Choose a date"
          className="fixed z-[110] rounded-xl border border-border bg-surface p-3 text-foreground shadow-2xl"
          style={{ top: position.top, left: position.left, width: position.width }}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-background-subtle hover:text-foreground"
            >
              <Icon name="caret-left" size={16} />
            </button>
            <div className="text-sm font-semibold">{monthLabel}</div>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-background-subtle hover:text-foreground"
            >
              <Icon name="caret-right" size={16} />
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-muted">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="py-1">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {days.map(day => {
              const inMonth = day.getMonth() === month.getMonth();
              const isSelected = selectedDate !== null && sameDay(day, selectedDate);
              const isToday = sameDay(day, today);
              return (
                <button
                  key={dateValue(day)}
                  type="button"
                  aria-label={new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)}
                  aria-pressed={isSelected}
                  onClick={() => chooseDate(day)}
                  className={`mx-auto grid h-8 w-8 place-items-center rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-accent text-accent-contrast font-semibold'
                      : `${inMonth ? 'text-foreground' : 'text-muted/50'} hover:bg-background-subtle ${isToday ? 'border border-accent text-accent' : ''}`
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
            <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="px-2 py-1 text-xs font-medium text-muted hover:text-foreground">Clear</button>
            <button type="button" onClick={() => chooseDate(today)} className="px-2 py-1 text-xs font-semibold text-accent hover:opacity-80">Today</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
