import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkDownRenderer = ({ content }) => {
    return (
        <div className="prose prose-sm max-w-none prose-slate">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1
                            className="text-xl font-semibold text-gray-900 mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2
                            className="text-lg font-semibold text-gray-800 mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3
                            className="text-base font-semibold text-gray-800 mt-3 mb-1"
                            {...props}
                        />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4
                            className="text-sm font-semibold text-gray-700 mt-3 mb-1"
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <p
                            className="text-sm text-gray-700 leading-relaxed mb-2"
                            {...props}
                        />
                    ),
                    a: ({ node, ...props }) => (
                        <a
                            className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul
                            className="list-disc pl-5 text-sm text-gray-700 mb-2 space-y-1"
                            {...props}
                        />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol
                            className="list-decimal pl-5 text-sm text-gray-700 mb-2 space-y-1"
                            {...props}
                        />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                        <em className="italic text-gray-700" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-3"
                            {...props}
                        />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={dracula}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg text-sm my-3"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                className="bg-gray-100 text-emerald-700 px-1 py-0.5 rounded text-xs font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre:({node, ...props})=> <pre className="" {...props}/>
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkDownRenderer;
