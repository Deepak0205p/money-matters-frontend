"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";

function CodeBlock({ node, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match && !String(children).includes('\n');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isInline && match) {
    return (
      <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-rose-500" />
              <div className="size-2.5 rounded-full bg-amber-500" />
              <div className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono text-slate-400 font-semibold">{match[1]}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </motion.button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: "#0f172a",
            padding: "1rem",
            fontSize: "0.85rem",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold" {...props}>
      {children}
    </code>
  );
}

export function MarkdownRenderer({ content }) {
  return (
    <div className="max-w-none break-words leading-relaxed text-slate-800 text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold underline underline-offset-2 transition-colors"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
              <table className="w-full text-xs text-left border-collapse bg-white" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-b border-slate-200 px-4 py-2.5 font-extrabold text-slate-900 bg-slate-50"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-slate-100 px-4 py-2.5 align-top text-slate-700 font-medium" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-3.5 last:mb-0 text-slate-800 leading-relaxed font-normal" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-3.5 space-y-1.5 text-slate-800" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-3.5 space-y-1.5 text-slate-800" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed font-normal text-slate-800" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-emerald-600 pl-4 italic text-slate-700 bg-emerald-50/50 py-2.5 rounded-r-xl my-4 text-sm font-medium"
              {...props}
            />
          ),
          h1: ({ node, ...props }) => <h1 className="text-xl font-extrabold text-slate-900 mt-5 mb-3 tracking-tight" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-900 mt-4 mb-2 tracking-tight" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-slate-900 mt-3.5 mb-1.5" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-slate-700" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
