import React, { useEffect, useState } from 'react';

interface MathTextProps {
  text: string;
  className?: string;
  isInline?: boolean;
}

declare global {
  interface Window {
    katex: any;
  }
}

// Simple component to render a single parsed table row
const TableRow: React.FC<{ row: string, rowIndex: number }> = ({ row, rowIndex }) => {
  if (!row) return null;
  // Split by pipe, filtering out empty strings at start/end if pipe is at boundary
  const cells = row.split('|').map(c => c.trim()).filter((_, i, arr) => {
     // If line starts with |, first element is empty. If ends with |, last is empty.
     // Heuristic: usually Markdown tables are | A | B |
     if (i === 0 && row.trim().startsWith('|')) return false;
     if (i === arr.length - 1 && row.trim().endsWith('|')) return false;
     return true;
  });

  // Decide if it is a header row (simple heuristic: first row is often header)
  // But strictly, markdown uses the |---|---| row to define headers.
  // For visual simplicity, we'll just style all cells nicely.
  
  return (
    <tr className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      {cells.map((cell, i) => (
        <td key={i} className="border border-slate-200 px-4 py-2 text-sm text-slate-700">
           {/* Recursive call to render math inside cells */}
           <MathTextRenderer text={cell} isInline={true} />
        </td>
      ))}
    </tr>
  );
};

// Internal renderer that splits text by LaTeX delimiters
const MathTextRenderer: React.FC<{ text: string, isInline?: boolean }> = ({ text, isInline }) => {
   const [nodes, setNodes] = useState<React.ReactNode[]>([]);

   useEffect(() => {
    if (!text) {
        setNodes([]);
        return;
    }
    if (typeof window.katex === 'undefined') {
        setNodes([<span key="fallback">{text}</span>]);
        return;
    }

    const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const parts = text.split(regex);

    const newNodes = parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
           const math = part.slice(2, -2);
           try {
             const html = window.katex.renderToString(math, { displayMode: true, throwOnError: false });
             return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2 overflow-x-auto" />;
           } catch (e) {
             return <span key={index}>{part}</span>;
           }
        } else if (part.startsWith('$') && part.endsWith('$')) {
           const math = part.slice(1, -1);
           try {
             const html = window.katex.renderToString(math, { displayMode: false, throwOnError: false });
             return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
           } catch (e) {
             return <span key={index}>{part}</span>;
           }
        } else {
           return <span key={index}>{part}</span>;
        }
    });
    setNodes(newNodes);
   }, [text]);

   return <>{nodes}</>;
}


const MathText: React.FC<MathTextProps> = ({ text, className = '', isInline = false }) => {
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (!text) {
        setContent(null);
        return;
    }
    // 1. Check for Markdown Tables
    // Regex for a block that looks like a table (lines starting with |)
    // We will process line by line to be robust
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let tableBuffer: string[] = [];

    const flushTable = () => {
        if (tableBuffer.length === 0) return;
        
        // Check if it's a valid table (has at least 2 rows usually, one for header, one for separator)
        // Simplistic rendering:
        // Filter out the separator line |---|---|
        const validRows = tableBuffer.filter(row => !/^[\s|:-]+$/.test(row));
        
        const tableNode = (
            <div key={`table-${nodes.length}`} className="my-6 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                         {/* Assume first row is header */}
                         {validRows.length > 0 && (
                            <tr>
                                {validRows[0].split('|').map(c => c.trim()).filter((_, i, arr) => {
                                    if (i === 0 && validRows[0].trim().startsWith('|')) return false;
                                    if (i === arr.length - 1 && validRows[0].trim().endsWith('|')) return false;
                                    return true;
                                }).map((h, i) => (
                                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                                        <MathTextRenderer text={h} isInline={true} />
                                    </th>
                                ))}
                            </tr>
                         )}
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {validRows.slice(1).map((row, idx) => (
                            <TableRow key={idx} row={row} rowIndex={idx} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
        nodes.push(tableNode);
        tableBuffer = [];
    };

    let inTable = false;

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        const isTableLine = trimmed.startsWith('|') && (trimmed.endsWith('|') || trimmed.split('|').length > 2);

        if (isTableLine) {
            inTable = true;
            tableBuffer.push(trimmed);
        } else {
            if (inTable) {
                flushTable();
                inTable = false;
            }
            // Add normal text line (with math parsing)
            // If the line is empty, render a break?
            if (trimmed === '') {
                 nodes.push(<div key={i} className="h-4"></div>);
            } else {
                 nodes.push(
                    <div key={i} className={isInline ? "inline" : "block mb-1"}>
                        <MathTextRenderer text={line} />
                    </div>
                 );
            }
        }
    });
    flushTable(); // Flush if ended in table

    setContent(nodes);
  }, [text, isInline]);

  const Container = isInline ? 'span' : 'div';
  return <Container className={className}>{content}</Container>;
};

export default MathText;