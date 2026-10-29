import type { ReactNode } from 'react';

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/s);
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/s);

    const candidates = [
      boldMatch ? { match: boldMatch, tag: 'strong' as const } : null,
      italicMatch ? { match: italicMatch, tag: 'em' as const } : null,
    ].filter(Boolean) as { match: RegExpMatchArray; tag: 'strong' | 'em' }[];

    if (candidates.length === 0) {
      nodes.push(remaining);
      break;
    }

    candidates.sort((a, b) => (a.match[1].length <= b.match[1].length ? -1 : 1));
    const { match, tag } = candidates[0];
    const before = match[1];
    const inner = match[2];
    const after = remaining.slice(match[0].length);

    if (before) nodes.push(before);
    nodes.push(
      tag === 'strong' ? (
        <strong key={`${keyBase}-${key++}`} className="font-semibold">
          {renderInline(inner, `${keyBase}-i${key}`)}
        </strong>
      ) : (
        <em key={`${keyBase}-${key++}`} className="italic">
          {renderInline(inner, `${keyBase}-i${key}`)}
        </em>
      ),
    );
    remaining = after;
  }

  return nodes;
}

function parseTable(lines: string[], startIdx: number): { rows: string[][]; nextIdx: number } | null {
  const headerLine = lines[startIdx]?.trim();
  const separatorLine = lines[startIdx + 1]?.trim();
  if (!headerLine || !separatorLine) return null;

  const isSeparator = /^\|?[\s:-]+\|[\s:-|]+$/.test(separatorLine);
  if (!isSeparator) return null;

  const splitRow = (line: string): string[] =>
    line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

  const header = splitRow(headerLine);
  if (header.length < 1) return null;

  const rows: string[][] = [header];
  let i = startIdx + 2;
  while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
    rows.push(splitRow(lines[i]));
    i++;
  }

  return { rows, nextIdx: i };
}

interface Block {
  type: 'p' | 'ul' | 'ol' | 'table' | 'h';
  level?: number;
  items?: string[];
  rows?: string[][];
  text?: string;
}

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'h', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    if (line.trim().startsWith('|')) {
      const table = parseTable(lines, i);
      if (table) {
        blocks.push({ type: 'table', rows: table.rows });
        i = table.nextIdx;
        continue;
      }
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (orderedMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\d+)\.\s+(.+)/);
        if (!m) break;
        items.push(m[2]);
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.+)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', text: paraLines.join(' ') });
  }

  return blocks;
}

function stripUnsafeContent(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<\/?svg[^>]*>/gi, '')
    .replace(/<\/?(svg|script|iframe|object|embed|style|meta|link|base|form|input|button|textarea|select|option|applet|area|audio|video|source|track|canvas|portal|slot|template|math|annotation|annotation-xml|foreignObject|desc|title|symbol|use|image|pattern|marker|clipPath|mask|filter|fe[A-Za-z]+|linearGradient|radialGradient|stop|defs|g|path|rect|circle|ellipse|line|polyline|polygon|text|tspan|textPath)[^>]*>/gi, '');
}

export function MarkdownText({ content }: { content: string }) {
  const cleaned = stripUnsafeContent(content);
  const blocks = parseBlocks(cleaned);

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h': {
            const sizeClass =
              block.level === 1
                ? 'text-base font-bold'
                : block.level === 2
                ? 'text-sm font-bold'
                : 'text-sm font-semibold';
            return (
              <p key={idx} className={`${sizeClass} text-navy-900`}>
                {renderInline(block.text!, `h${idx}`)}
              </p>
            );
          }
          case 'p':
            return (
              <p key={idx} className="leading-relaxed">
                {renderInline(block.text!, `p${idx}`)}
              </p>
            );
          case 'ul':
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 leading-relaxed">
                {block.items!.map((item, j) => (
                  <li key={j}>{renderInline(item, `ul${idx}-${j}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx} className="list-decimal pl-5 space-y-1 leading-relaxed">
                {block.items!.map((item, j) => (
                  <li key={j}>{renderInline(item, `ol${idx}-${j}`)}</li>
                ))}
              </ol>
            );
          case 'table': {
            const rows = block.rows!;
            if (rows.length < 1) return null;
            return (
              <div key={idx} className="overflow-x-auto">
                <table className="w-full text-xs border border-navy-100 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {rows[0].map((cell, j) => (
                        <th key={j} className="px-2.5 py-1.5 text-left font-semibold text-navy-700 border-b border-navy-100">
                          {renderInline(cell, `th${idx}-${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(1).map((row, j) => (
                      <tr key={j} className={j % 2 === 1 ? 'bg-slate-50/50' : ''}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-2.5 py-1.5 border-b border-navy-50">
                            {renderInline(cell, `td${idx}-${j}-${k}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
