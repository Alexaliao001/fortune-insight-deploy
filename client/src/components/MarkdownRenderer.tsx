import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

/**
 * Lightweight markdown renderer that replaces Streamdown.
 * Streamdown pulls in mermaid (423KB), shiki (code highlighting), cytoscape (442KB),
 * and katex which we don't need for fortune reading content.
 * This component uses react-markdown + remark-gfm which is ~50KB total.
 */
export default function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-amber-300 mb-3 mt-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold text-amber-200 mb-2 mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium text-amber-100 mb-2 mt-2">{children}</h3>,
          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3">{children}</p>,
          strong: ({ children }) => <strong className="text-amber-200 font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-purple-300 italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-amber-500/50 pl-4 my-3 text-gray-400 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-white/10 my-4" />,
          a: ({ href, children }) => (
            <a href={href} className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="px-3 py-2 text-left text-amber-200 border-b border-white/10">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-gray-300 border-b border-white/5">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
