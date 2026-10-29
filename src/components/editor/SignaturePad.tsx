import React, { useRef, useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
}

export function SignaturePad({ value, onChange, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Load existing signature if any
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = value;
    }
  }, []);
  
  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoords(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#14161A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    setIsDrawing(true);
    setHasDrawn(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save signature
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };
  
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    setHasDrawn(false);
    onClear();
  };
  
  return (
    <div className="border border-rule rounded-md p-3 bg-background/30 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">Digital Signature</label>
        <button
          onClick={handleClear}
          className="text-[11px] text-muted hover:text-danger transition-colors"
        >
          Clear Pad
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full border border-rule bg-surface rounded-md cursor-crosshair touch-none"
        style={{ height: '112px' }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      <p className="text-[10px] text-muted">Draw your signature above with a mouse or touch screen.</p>
    </div>
  );
}
