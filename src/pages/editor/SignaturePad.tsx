import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
  height?: number;
  label?: string;
  hint?: string;
}

export function SignaturePad({
  value,
  onChange,
  onClear,
  height = 112,
  label = 'Digital Signature',
  hint = 'Draw your signature above with a mouse or touch screen.',
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const hasDrawn = useRef(false);
  const lastEmitted = useRef(value || '');
  const valueRef = useRef(value);
  valueRef.current = value;

  const drawStoredImage = useCallback(
    (ctx: CanvasRenderingContext2D, src: string, width: number, h: number) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(width / img.width, h / img.height);
        const w = img.width * scale;
        const hh = img.height * scale;
        ctx.drawImage(img, (width - w) / 2, (h - hh) / 2, w, hh);
      };
      img.src = src;
    },
    []
  );

  const paintCanvas = useCallback(
    (src: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, h);
      if (src) drawStoredImage(ctx, src, width, h);
    },
    [drawStoredImage]
  );

  // Initialize and handle responsive canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const width = Math.round(canvas.getBoundingClientRect().width);
      if (!width) return;
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.round(width * dpr);
      const targetHeight = Math.round(height * dpr);
      if (canvas.width === targetWidth && canvas.height === targetHeight) return;

      const previousImage =
        hasDrawn.current && canvas.width && canvas.height ? canvas.toDataURL('image/png') : '';
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const imageSource = previousImage || valueRef.current;
      if (!imageSource) return;
      drawStoredImage(ctx, imageSource, width, height);
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    return () => observer.disconnect();
  }, [height, drawStoredImage]);

  // Repaint when the value changes externally (e.g. upload from settings)
  useEffect(() => {
    const next = value || '';
    if (next === lastEmitted.current) return;
    lastEmitted.current = next;
    hasDrawn.current = !!next;
    paintCanvas(next);
  }, [value, paintCanvas]);

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
    lastEmitted.current = dataUrl;
    onChange(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, h);

    hasDrawn.current = false;
    lastEmitted.current = '';
    onClear();
  };

  return (
    <div ref={containerRef} className="border border-rule rounded-md p-3 bg-background/30 space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs font-semibold text-foreground truncate">{label}</label>
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
        style={{ height: `${height}px`, width: '100%' }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      <p className="text-[10px] text-muted">{hint}</p>
    </div>
  );
}
