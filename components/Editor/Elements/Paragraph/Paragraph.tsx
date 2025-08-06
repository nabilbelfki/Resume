// in Paragraph.tsx

import React, { useRef, useEffect } from "react";
import styles from "./Paragraph.module.css";

interface ParagraphProps {
    editable: boolean;
    textAlign?: 'left' | 'center' | 'right';
    onEnter: () => void;
    onContentUpdate: (content: string) => void;
    content: string;
    onDelete: () => void; 
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(({ editable, textAlign = 'left', onEnter, onContentUpdate, onDelete, content }, ref) => {
    
    const internalRef = useRef<HTMLParagraphElement>(null);

    // This effect runs only when the content prop from the parent changes,
    // like when converting from a heading. It sets the innerHTML.
    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            internalRef.current.innerHTML = content;
        }
    }, [content]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
        } else if (e.key === 'Backspace') {
            const isCursorAtStart = window.getSelection()?.anchorOffset === 0;
            // Check if the paragraph is empty and cursor is at the start
            if (e.currentTarget.textContent?.trim() === '' && isCursorAtStart) {
                e.preventDefault();
                onDelete();
            }
        }
    };

    const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
        onContentUpdate(e.currentTarget.innerHTML);
    };

    const refToUse = (el: HTMLParagraphElement | null) => {
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLParagraphElement | null>).current = el;
        }
        (internalRef as React.MutableRefObject<HTMLParagraphElement | null>).current = el;
    };
    
    return (
        <p
            ref={refToUse}
            className={styles.paragraph}
            style={{ textAlign }}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
        />
    );
});

Paragraph.displayName = "Paragraph";
export default Paragraph;