import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { today } from '../../lib/dates';
import type { Expense } from '../../types';

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  initialData?: Expense;
}

export function ExpenseDialog({ open, onClose, onSave, initialData }: ExpenseDialogProps) {
  const [date, setDate] = useState(today());
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setDate(initialData.date);
        setVendor(initialData.vendor);
        setCategory(initialData.category);
        setAmount(initialData.amount);
        setCurrency(initialData.currency);
        setTax(initialData.tax || 0);
        setNotes(initialData.note || '');
      } else {
        setDate(today());
        setVendor('');
        setCategory('');
        setAmount(0);
        setCurrency('USD');
        setTax(0);
        setNotes('');
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }
    if (amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    onSave({
      date,
      vendor: vendor.trim(),
      category: category.trim() || 'General',
      amount,
      currency,
      tax: tax || undefined,
      note: notes.trim() || undefined,
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
      title={initialData ? 'Edit Expense' : 'Add Expense'}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="expense-dialog-form" onClick={() => handleSubmit()}>
            {initialData ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      }
    >
      <form id="expense-dialog-form" onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Vendor <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm ${
                errors.vendor ? 'border-danger' : 'border-border'
              }`}
              placeholder="Vendor name"
              autoFocus
            />
            {errors.vendor && <p className="mt-1 text-xs text-danger">{errors.vendor}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            placeholder="General"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Amount <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm ${
                errors.amount ? 'border-danger' : 'border-border'
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="NGN">NGN</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Tax</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm resize-none"
            placeholder="Optional notes..."
            rows={3}
          />
        </div>
      </form>
    </Dialog>
  );
}
