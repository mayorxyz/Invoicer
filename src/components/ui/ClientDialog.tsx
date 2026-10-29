import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import type { Client } from '../../types';

interface ClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
  initialData?: Client;
}

export function ClientDialog({ open, onClose, onSave, initialData }: ClientDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setEmail(initialData.email || '');
        setPhone(initialData.phone || '');
        setAddress(initialData.address || '');
        setTaxId(initialData.taxId || '');
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setTaxId('');
        setNotes('');
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      taxId: taxId.trim() || undefined,
      notes: notes.trim() || undefined,
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
      title={initialData ? 'Edit Client' : 'New Client'}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="client-dialog-form" onClick={() => handleSubmit()}>
            {initialData ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      }
    >
      <form id="client-dialog-form" onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4 max-h-[70vh] overflow-y-auto px-1" onKeyDown={handleKeyDown}>
        <div>
          <label className="block text-xs md:text-sm font-medium text-foreground mb-1">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 bg-background border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent ${
              errors.name ? 'border-danger' : 'border-border'
            }`}
            placeholder="Client name"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent ${
                errors.email ? 'border-danger' : 'border-border'
              }`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent border-border"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="Street address, city, state, zip"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Tax ID</label>
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent border-border"
            placeholder="TAX-12345678"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="Additional notes..."
            rows={3}
          />
        </div>
      </form>
    </Dialog>
  );
}