/**
 * Lightweight component for rendering basic markdown (italics only)
 *
 * Converts *text* to <em>text</em> while preserving:
 * - Text selection and copying
 * - Screen reader accessibility
 * - Semantic HTML structure
 */

type MarkdownTextProps = { children: string; className?: string };

export function MarkdownText({ children, className }: MarkdownTextProps) {
    // Split on *...* patterns for italics, preserving the delimiters
    const parts = children.split(/(\*[^*]+\*)/g);

    return (
        <span className={className}>
            {parts.map((part, i) =>
                part.startsWith('*') && part.endsWith('*') ? (
                    <em key={`em-${i}-${part.slice(1, 6)}`}>{part.slice(1, -1)}</em>
                ) : (
                    <span key={`txt-${i}-${part.slice(0, 5)}`}>{part}</span>
                ),
            )}
        </span>
    );
}
