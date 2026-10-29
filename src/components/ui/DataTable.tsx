import React from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ columns, data, onRowClick, emptyMessage = 'No data available' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 text-center text-muted text-xs md:text-sm shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
          <thead className="bg-background-subtle/60 border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3.5 py-2.5 md:px-4 md:py-3 text-[11px] md:text-xs font-semibold text-muted uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${
                  onRowClick 
                    ? 'hover:bg-background-subtle/50 cursor-pointer active:bg-background-subtle/80' 
                    : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-3.5 py-2.5 md:px-4 md:py-3 text-xs md:text-sm text-foreground ${col.className || ''}`}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}