import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { today } from '../../lib/dates';
import type { TimeEntry } from '../../types';

interface TimeEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimeEntry, 'id'>) => void;
  initialData?: TimeEntry;
}

export function TimeEntryDialog({ open, onClose, onSave, initialData }: TimeEntryDialogProps) {
  const [date, setDate] = useState(today());
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [rate, setRate] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setDate(initialData.startTime.split('T')[0]);
        setClientId(initialData.clientId);
        setDescription(initialData.description);
        setStartTime(initialData.startTime.split('T')[1]?.substring(0, 5) || '09:00');
        setEndTime(initialData.endTime?.split('T')[1]?.substring(0, 5) || '17:00');
        setRate(initialData.rate);
      } else {
        setDate(today());
        setClientId('');
        setDescription('');
        setStartTime('09:00');
        setEndTime('17:00');
        setRate(0);
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (rate <= 0) {
      newErrors.rate = 'Rate must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    onSave({
      clientId,
      project: '',
      description: description.trim(),
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`,
      rate,
      currency: 'USD',
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Time Entry' : 'Add Time Entry'}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="time-entry-dialog-form" onClick={() => handleSubmit()}>
            {initialData ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      }
    >
      <form id="time-entry-dialog-form" onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Client</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm resize-none ${
              errors.description ? 'border-danger' : 'border-border'
            }`}
            placeholder="What did you work on?"
            rows={3}
            autoFocus
          />
          {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Hourly Rate <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm ${
              errors.rate ? 'border-danger' : 'border-border'
            }`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.rate && <p className="mt-1 text-xs text-danger">{errors.rate}</p>}
        </div>
      </form>
    </Dialog>
  );
}
