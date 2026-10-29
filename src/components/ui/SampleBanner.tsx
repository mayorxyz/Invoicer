import React from 'react';
import { Button } from './Button';

interface SampleBannerProps {
  onClear: () => void;
}

export function SampleBanner({ onClear }: SampleBannerProps) {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-sm bg-accent" />
        <p className="text-sm text-foreground">
          Sample data. Edit or add anything and it is replaced with your own.
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear sample data
      </Button>
    </div>
  );
}
