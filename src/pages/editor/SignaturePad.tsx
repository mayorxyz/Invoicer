import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
}

export function SignaturePad({ value, onChange, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const hasDrawn = useRef(false);
  
  // Initialize and handle responsive canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const height = 112; // fixed height matching style
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = Math.round(canvas.getBoundingClientRect().width);
      if (!width) return;
      const targetWidth = Math.round(width * dpr);
      const targetHeight = Math.round(height * dpr);
      if (canvas.width === targetWidth && canvas.height === targetHeight) return;

      const previousImage = canvas.width && canvas.height ? canvas.toDataURL('image/png') : '';
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const imageSource = hasDrawn.current && previousImage ? previousImage : value;
      if (!imageSource) return;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        hasDrawn.current = true;
      };
      img.src = imageSource;
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    return () => observer.disconnect();
  }, [value]);
  
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
    hasDrawn.current = true;
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
    
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
    hasDrawn.current = false;
    onClear();
  };
  
  return (
    <div ref={containerRef} className="border border-rule rounded-md p-3 bg-background/30 space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs font-semibold text-foreground truncate">Digital Signature</label>
        <button
          onClick={handleClear}
          className="text-[11px] text-muted hover:text-danger transition-colors shrink-0"
        >
          Clear Pad
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full border border-rule bg-surface rounded-md cursor-crosshair touch-none block"
        style={{ height: '112px', width: '100%' }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      <p className="text-[10px] text-muted">Draw your signature above with a mouse or touch screen.</p>
    </div>
  );
}