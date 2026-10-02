"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface ChatMarkdownProps {
  content: string;
}

export const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ content }) => {
  // Split into code blocks and normal text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-[13.5px] leading-relaxed break-words font-sans text-zinc-200">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const firstLineEnd = part.indexOf("\n");
          let language = "code";
          let codeContent = part.slice(3, -3);

          if (firstLineEnd !== -1) {
            language = part.slice(3, firstLineEnd).trim() || "code";
            codeContent = part.slice(firstLineEnd + 1, -3);
          }

          return (
            <CodeBlock key={index} language={language} code={codeContent.trim()} />
          );
        }

        return <FormattedText key={index} text={part} />;
      })}
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({
  language,
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-lg border border-white/[0.08] bg-[#07090e] overflow-hidden font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-white/[0.06] text-zinc-400">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-cyan-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors text-[11px] px-2 py-0.5 rounded hover:bg-white/10"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-emerald-300 font-mono text-xs leading-5">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const rawLines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`gap-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // Check for Markdown table: lines starting and ending with '|'
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < rawLines.length &&
        rawLines[i].trim().startsWith("|") &&
        rawLines[i].trim().endsWith("|")
      ) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const dataRows = tableLines.slice(2).map((row) =>
          row
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-zinc-950/60 font-sans text-xs"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3 py-2 font-semibold text-cyan-300">
                      {formatInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 text-zinc-300">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Heading 3: ### Heading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-sm font-bold text-white mt-2.5 mb-1 flex items-center gap-1.5 tracking-tight"
        >
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-base font-bold text-white mt-3 mb-1.5 flex items-center gap-1.5 tracking-tight"
        >
          {formatInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-cyan-400 pl-3 my-1.5 italic text-zinc-300 bg-cyan-950/20 py-1 rounded-r text-[13px]"
        >
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Bullet list: - text or * text
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-cyan-400 mt-1 text-xs">•</span>
          <span className="flex-1">{formatInline(trimmed.slice(2))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list: 1. text
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-cyan-400 font-mono text-xs font-semibold mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="flex-1">{formatInline(numMatch[2])}</span>
        </div>
      );
      i++;
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-0.5">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
};

/**
 * Format inline elements: **bold**, *italic*, `code`, and [links](url)
 */
function formatInline(str: string): React.ReactNode[] {
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(str.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];

    // Markdown link: [text](url)
    if (fullMatch.startsWith("[")) {
      const linkText = match[2];
      const linkUrl = match[3];
      nodes.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium cursor-pointer"
        >
          {linkText}
        </a>
      );
    }
    // Inline code: `code`
    else if (fullMatch.startsWith("`")) {
      nodes.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-cyan-300 font-mono text-[11.5px] border border-white/10"
        >
          {match[4]}
        </code>
      );
    }
    // Bold: **text**
    else if (fullMatch.startsWith("**")) {
      nodes.push(
        <strong key={match.index} className="font-semibold text-white">
          {match[5]}
        </strong>
      );
    }
    // Italic: *text*
    else if (fullMatch.startsWith("*")) {
      nodes.push(
        <em key={match.index} className="italic text-zinc-300">
          {match[6]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    nodes.push(str.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [str];
}
