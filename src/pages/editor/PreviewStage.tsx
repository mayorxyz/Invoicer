import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { IconButton } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { PaperClassic } from '../../components/papers/Classic';
import { PaperModern } from '../../components/papers/Modern';
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
export function PreviewStage({ signature = '', photos = [] }: { signature?: string; photos?: string[] }) {
  const { draft, updateDraft, state } = useStore();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);

  if (!draft) return null;

  const totalPages = 1; // Simplified for now
  const paperWidthClass = draft.paperSize === 'A4' ? 'w-[210mm]' : 'w-[216mm]';
  const accent = state.settings.accent || draft.accent;

  return (
    <div className="flex flex-col h-full bg-background-subtle/40 rounded-2xl border border-rule overflow-hidden">
      {/* Toolbar */}
      <div className="bg-surface border-b border-rule flex items-center justify-between px-3.5 py-2.5 no-print flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <IconButton icon="magnifying-glass" size="sm" onClick={() => setZoom(100)} title="Reset Zoom" />
          <span className="text-xs md:text-sm font-mono text-muted w-10 text-center">{zoom}%</span>
          <IconButton icon="plus" size="sm" onClick={() => setZoom(z => Math.min(150, z + 25))} title="Zoom In" />
          <IconButton icon="minus" size="sm" onClick={() => setZoom(z => Math.max(50, z - 25))} title="Zoom Out" />
        </div>

        <div className="flex items-center gap-1.5">
          <IconButton icon="caret-left" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} title="Previous Page" />
          <span className="text-xs md:text-sm text-muted font-medium">
            Page {page} of {totalPages}
          </span>
          <IconButton icon="caret-right" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} title="Next Page" />
        </div>
      </div>

      {/* Preview Stage Container */}
      <div className="flex-1 overflow-auto preview-stage p-4 md:p-8 flex justify-center items-start" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div
          className={`transition-transform duration-200 shadow-xl bg-surface rounded-lg origin-top mx-auto ${paperWidthClass}`}
          style={{
            transform: `scale(${zoom / 100})`,
            marginBottom: zoom > 100 ? `${(zoom - 100) * 4}px` : '0px',
          }}
        >
          {draft.template === 'default' && (
            <PaperDefault
              draft={draft}
              business={state.businesses[0]}
              totals={totals(draft)}
              accent={accent}
              shipToEnabled={!!draft.shipToAddress}
              signature={signature}
              photos={photos}
              paymentTerms={draft.terms}
              poNumber={draft.customFields?.find(f => f.label === 'PO Number')?.value || ''}
            />
          )}
          {draft.template === 'classic' && <PaperClassic accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'modern' && <PaperModern accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'minimal' && <PaperMinimal accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'corporate' && <PaperCorporate accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'formal' && <PaperFormal accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'framed' && <PaperFramed accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'retro' && <PaperRetro accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'sidebar' && <PaperSidebar accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'split' && <PaperSplit accent={accent} signature={signature} photos={photos} />}
          {draft.template === 'modernclean' && <PaperModernClean accent={accent} signature={signature} photos={photos} />}
        </div>
      </div>
    </div>
  );
}