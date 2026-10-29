import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  requireTypedConfirmation?: string; // e.g., 'DELETE' for delete-all actions
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  requireTypedConfirmation,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = React.useState('');
  const canConfirm = !requireTypedConfirmation || typedValue === requireTypedConfirmation;

  React.useEffect(() => {
    if (!open) {
      setTypedValue('');
    }
  }, [open]);

  const handleConfirmAction = () => {
    if (canConfirm) {
      onConfirm();
      onClose();
    }
  };

  return (
    <div className="relative z-50">
      <Dialog
        open={open}
        onClose={onClose}
        title={title}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="secondary" onClick={onClose} type="button">
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAction}
              disabled={!canConfirm}
              className={variant === 'danger' ? 'bg-danger hover:bg-danger/90 text-white' : ''}
              type="button"
            >
              {confirmLabel}
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5 md:space-y-4">
          <p className="text-xs md:text-sm text-muted leading-relaxed">{description}</p>
          {requireTypedConfirmation && (
            <div className="space-y-1.5">
              <label className="block text-xs md:text-sm font-medium text-foreground">
                Type <span className="font-mono font-bold text-danger">{requireTypedConfirmation}</span> to confirm
              </label>
              <input
                type="text"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder={requireTypedConfirmation}
                autoFocus
              />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}