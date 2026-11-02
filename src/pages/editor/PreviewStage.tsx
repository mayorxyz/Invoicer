import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Icon } from '../../components/ui/Icon';
import { PaperMinimal } from '../../components/papers/Minimal';
import { PaperDefault } from '../../components/papers/Default';
import { PaperCorporate } from '../../components/papers/Corporate';
import { Paperformal as PaperFormal } from '../../components/papers/formal';
import { PaperFramed } from '../../components/papers/Framed';
import { PaperRetro } from '../../components/papers/Retro';
import { PaperSidebar } from '../../components/papers/Sidebar';
import { PaperSplit } from '../../components/papers/Split';
import { PaperModernClean } from '../../components/papers/ModernClean';
import { totals } from '../../lib/money';
import { useFontScale } from '../../components/ui/FontSizeControl';
import { PaperTypography, useFontStyle } from '../../components/ui/FontStyleControl';

const PAGE_PAD = 32;
const NO_PHOTOS: string[] = [];

export function computePageStarts(root: HTMLElement, pageH: number): number[] {
  const rootTop = root.getBoundingClientRect().top;
  const total = root.scrollHeight;
  const units = Array.from(
    root.querySelectorAll('[data-pdf-break], [data-pdf-row], tbody tr, li')
  )
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top - rootTop, bottom: r.bottom - rootTop };
    })
    .filter((u) => u.bottom > u.top)
    .sort((a, b) => a.top - b.top);

  const starts = [0];
  let start = 0;
  while (start + pageH < total - 1) {
    const end = start + pageH;
    let brk = end;
    for (const u of units) {
      if (u.top >= end) break;
      if (u.top > start + 1 && u.bottom > end + 0.5 && u.bottom - u.top <= pageH) {
        brk = u.top;
        break;
      }
    }
    if (brk <= start + 1) brk = end;
    starts.push(brk);
    start = brk;
  }
  return starts;
}

const sameArr = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.5);

export function PreviewStage({
  signature = '',
  photos = NO_PHOTOS,
  paper,
}: { signature?: string; photos?: string[]; paper?: React.ReactNode }) {
  const { draft, state } = useStore();
  const fontScale = useFontScale();
  const fontStyle = useFontStyle();
  const [zoom, setZoom] = useState(100);
  const [fitScale, setFitScale] = useState(1);
  const [page, setPage] = useState(1);
  const [starts, setStarts] = useState<number[]>([0]);
  const [contentH, setContentH] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollRef.current;
    if (!drag || !el) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    el.scrollLeft = drag.left - dx;
    el.scrollTop = drag.top - dy;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.style.cursor = '';
    el.style.userSelect = '';
    dragRef.current = null;
    if (drag.moved) {
      suppressClickRef.current = true;
      setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const isA4 = draft?.paperSize === 'A4';
  const paperWidthClass = isA4 ? 'w-[210mm]' : 'w-[216mm]';
  const paperWidth = isA4 ? 794 : 816;
  const PAGE_H = isA4 ? 1123 : 1056;
  const INNER_H = PAGE_H - PAGE_PAD * 2;
  const accent = state.settings.accent || draft?.accent;
  const totalPages = starts.length;

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const run = () => {
      const next = computePageStarts(el, INNER_H);
      setStarts((prev) => (sameArr(prev, next) ? prev : next));
      setContentH((h) => (Math.abs(h - el.scrollHeight) < 0.5 ? h : el.scrollHeight));
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    document.fonts?.ready.then(run);
    const onFontsLoaded = () => run();
    document.fonts?.addEventListener?.('loadingdone', onFontsLoaded);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', onFontsLoaded);
    };
  }, [draft, signature, photos, INNER_H, state.settings.accent, paper, fontScale, fontStyle]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const updateFit = () => {
      const styles = getComputedStyle(el);
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const availableWidth = Math.max(0, el.clientWidth - horizontalPadding);
      setFitScale(Math.min(1, availableWidth / paperWidth));
    };
    updateFit();
    const ro = new ResizeObserver(updateFit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [paperWidth]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setPage(Number((best.target as HTMLElement).dataset.page));
      },
      { root, threshold: [0.25, 0.5, 0.75] }
    );
    sheetRefs.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [totalPages, zoom]);

  const goTo = (p: number) => {
    setPage(p);
    sheetRefs.current[p - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!draft) return null;

  const extra = {
    shipToEnabled: !!(draft.shipToAddress || draft.shipToName),
    paymentTerms: (draft as any).paymentTerms ?? '',
    poNumber: draft.customFields?.find((f: any) => f.label === 'PO Number')?.value || '',
    showPageGuides: false,
  } as any;

  const renderSelectedTemplate = () => {
    if (paper) return paper;
    const common = { accent, signature, photos, ...extra };
    switch (draft.template) {
      case 'minimal': return <PaperMinimal {...common} />;
      case 'corporate': return <PaperCorporate {...common} />;
      case 'formal': return <PaperFormal {...common} />;
      case 'framed': return <PaperFramed {...common} />;
      case 'retro': return <PaperRetro {...common} />;
      case 'sidebar': return <PaperSidebar {...common} />;
      case 'split': return <PaperSplit {...common} />;
      case 'modernclean': return <PaperModernClean {...common} />;
      case 'default':
      default:
        return (
          <PaperDefault
            draft={draft}
            business={state.businesses[0]}
            totals={totals(draft)}
            accent={accent}
            shipToEnabled={extra.shipToEnabled}
            signature={signature}
            photos={photos}
            paymentTerms={draft.terms}
            poNumber={extra.poNumber}
          />
        );
    }
  };
  
  const actualZoom = Math.max(1, Math.round(fitScale * zoom));

  return (
    <div 
      className="pane flex flex-col flex-1 h-full w-full min-h-0 min-w-0 p-0 print-hide" 
      style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 6%, var(--background))' }}
    >
      {/* Borders removed, scrollbar hidden */}
      <div className="relative flex flex-col h-full w-full flex-1 bg-background rounded-2xl overflow-hidden shadow-inner">
        
        {/* Floating Slick Toolbar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-0.5 whitespace-nowrap rounded-full border border-rule/50 bg-surface/90 backdrop-blur-md p-1 shadow-lg no-print">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(25, z - 10))}
              title="Zoom Out"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-subtle hover:text-foreground active:scale-95"
            >
              <Icon name="minus" size={16} />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              title="Reset zoom to fit"
              className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-full px-1 text-[11px] font-mono tabular-nums text-muted transition-colors hover:bg-background-subtle hover:text-foreground"
            >
              {actualZoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              title="Zoom In"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-subtle hover:text-foreground active:scale-95"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>

          <span className="mx-0.5 h-3.5 w-px bg-rule/60" />

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => goTo(Math.max(1, page - 1))}
              disabled={page === 1}
              title="Previous Page"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-subtle hover:text-foreground active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="caret-left" size={16} />
            </button>
            <span className="inline-flex h-6 min-w-[2.25rem] items-center justify-center px-1 text-[11px] font-mono tabular-nums text-foreground">
              {page}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => goTo(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              title="Next Page"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-subtle hover:text-foreground active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="caret-right" size={16} />
            </button>
          </div>
        </div>

        {/* Canvas Area: Removed radial-gradient (dots) from background */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="flex-1 w-full h-full overflow-auto relative pt-16 pb-32 px-0 cursor-grab [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            backgroundColor: 'var(--background)'
          }}
        >
          {/* Off-screen unscaled measuring copy */}
          <div
            ref={measureRef}
            aria-hidden
            className={`fixed top-0 pointer-events-none invisible ${paperWidthClass}`}
            style={{ left: '-10000px' }}
          >
            <PaperTypography>{renderSelectedTemplate()}</PaperTypography>
          </div>

          {/* Scaled Paper Sheets */}
          <div className="mx-auto flex flex-col items-center gap-8 w-fit" style={{ zoom: (fitScale * zoom) / 100 } as React.CSSProperties}>
            {starts.map((start, idx) => {
              const nextStart = starts[idx + 1] ?? contentH;
              const visibleH = Math.max(0, Math.min(INNER_H, nextStart - start));
              return (
                <div
                  key={idx}
                  data-page={idx + 1}
                  ref={(el) => { sheetRefs.current[idx] = el; }}
                  className={`relative shrink-0 ${paperWidthClass} bg-surface transition-shadow duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]`}
                  style={{ 
                    height: `${PAGE_H}px`, 
                    paddingTop: `${PAGE_PAD}px`,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                >
                  <div style={{ height: `${visibleH}px`, overflow: 'hidden' }}>
                    <div style={{ marginTop: `-${start}px` }}><PaperTypography>{renderSelectedTemplate()}</PaperTypography></div>
                  </div>
                  
                  {/* Page Indicator Badge */}
                  <div className="absolute bottom-3 right-4 text-[10px] font-mono text-muted bg-surface/90 backdrop-blur px-2 py-0.5 rounded border border-rule/50 pointer-events-none z-20 no-print shadow-sm">
                    Page {idx + 1} of {totalPages}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}