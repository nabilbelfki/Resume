import React, { useRef, useEffect } from "react";
import styles from "./Heading.module.css";

interface HeadingProps {
    heading?: 2 | 3 | 4 | 5 | 6;
    textAlign?: 'left' | 'center' | 'right'; 
    editable: boolean;
    onEnter: () => void;
    onContentUpdate: (content: string) => void;
    onDelete: () => void;
    content: string;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ 
    editable, 
    heading = 2, 
    textAlign = 'left',
    onEnter,
    onContentUpdate,
    onDelete,
    content
}, ref) => {
    const internalRef = useRef<HTMLHeadingElement>(null);

    // This effect runs only when the content prop from the parent changes,
    // like when converting from a paragraph. It sets the innerHTML.
    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            internalRef.current.innerHTML = content;
        }
    }, [content]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
        } else if (e.key === 'Backspace') {
            const isCursorAtStart = window.getSelection()?.anchorOffset === 0;
            if (e.currentTarget.textContent?.trim() === '' && isCursorAtStart) {
                e.preventDefault();
                onDelete();
            }
        }
    };

    const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
        onContentUpdate(e.currentTarget.innerHTML);
    };

    const HeadingTag = `h${heading}` as React.ElementType;

    const refToUse = (el: HTMLHeadingElement | null) => {
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLHeadingElement | null>).current = el;
        }
        (internalRef as React.MutableRefObject<HTMLHeadingElement | null>).current = el;
    };

    return (
        <HeadingTag
            ref={refToUse}
            className={styles.heading}
            style={{ textAlign }}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
        />
    );
});

Heading.displayName = "Heading";
export default Heading;