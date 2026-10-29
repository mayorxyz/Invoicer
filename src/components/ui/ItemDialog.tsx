import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import type { SavedItem } from '../../types';

interface ItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<SavedItem, 'id'>) => void;
  initialData?: SavedItem;
}

export function ItemDialog({ open, onClose, onSave, initialData }: ItemDialogProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setSku(initialData.sku || '');
        setCategory(initialData.category || '');
        setUnit(initialData.unit);
        setPrice(initialData.price);
        setTax(0); // SavedItem doesn't have tax field, default to 0
        setActive(true);
      } else {
        setName('');
        setSku('');
        setCategory('');
        setUnit('pcs');
        setPrice(0);
        setTax(0);
        setActive(true);
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (price < 0) {
      newErrors.price = 'Price must be positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      sku: sku.trim() || undefined,
      category: category.trim() || undefined,
      unit,
      price,
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
      title={initialData ? 'Edit Item' : 'Add Item'}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="item-dialog-form" onClick={() => handleSubmit()}>
            {initialData ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      }
    >
      <form id="item-dialog-form" onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm ${
              errors.name ? 'border-danger' : 'border-border'
            }`}
            placeholder="Item name"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
              placeholder="SKU-001"
            />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm"
            >
              <option value="pcs">Pieces</option>
              <option value="hrs">Hours</option>
              <option value="days">Days</option>
              <option value="kg">Kilograms</option>
              <option value="m">Meters</option>
              <option value="service">Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Price <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm ${
                errors.price ? 'border-danger' : 'border-border'
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <p className="mt-1 text-xs text-danger">{errors.price}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="active" className="text-sm text-foreground">
            Active
          </label>
        </div>
      </form>
    </Dialog>
  );
}
