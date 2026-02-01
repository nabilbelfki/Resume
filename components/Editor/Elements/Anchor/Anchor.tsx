// in Anchor.tsx
import React, { useRef, useEffect } from "react";
import styles from "./Anchor.module.css";

interface AnchorProps {
    editable: boolean;
    content: string;
    onFocus: () => void;
    onContentUpdate: (content: string) => void;
    onDelete: () => void;
    onEnter: () => void;
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(({
    editable,
    content,
    onFocus,
    onContentUpdate,
    onDelete,
    onEnter
}, ref) => {
    const internalRef = useRef<HTMLAnchorElement>(null);

    // Sync content with the internal ref
    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            internalRef.current.innerHTML = content;
        }
    }, [content]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
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

    const handleInput = (e: React.FormEvent<HTMLAnchorElement>) => {
        onContentUpdate(e.currentTarget.innerHTML);
    };

    const refToUse = (el: HTMLAnchorElement | null) => {
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
        }
        (internalRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
    };

    return (
        <a
            ref={refToUse}
            href="#"
            className={styles.anchor}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={onFocus}
        />
    );
});

Anchor.displayName = "Anchor";
export default Anchor;
