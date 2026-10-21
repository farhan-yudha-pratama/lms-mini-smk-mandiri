'use client';

import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/CodeBlock';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose-neo leading-relaxed text-black font-sans">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            if (isInline) {
              return (
                <code
                  className="bg-mint-soft text-black px-1.5 py-0.5 border border-black font-mono text-sm font-black inline-block my-0.5"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-4">
                <CodeBlock
                  code={String(children).replace(/\n$/, '')}
                  language={match ? match[1] : 'javascript'}
                />
              </div>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight my-4 text-black border-b-4 border-black pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight my-4 text-black border-b-2 border-black pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg md:text-xl font-black uppercase my-3 text-black">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base font-bold text-gray-800 leading-relaxed my-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-gray-800 font-bold">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-gray-800 font-bold">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black pl-4 py-2 bg-mint-canvas my-4 font-bold italic shadow-neo-sm">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
