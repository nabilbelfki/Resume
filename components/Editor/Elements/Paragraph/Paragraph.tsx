import React, { useRef, useEffect } from "react";
import styles from "./Paragraph.module.css";

interface ParagraphProps {
    editable: boolean;
    textAlign?: 'left' | 'center' | 'right';
    onEnter: () => void;
    onContentUpdate: (content: string) => void;
    content: string;
    onDelete: () => void; 
    onFocus: () => void;
    onArrowUp: () => void;
    onArrowDown: () => void;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(({ 
    editable, 
    textAlign = 'left', 
    onEnter, 
    onContentUpdate, 
    onFocus, 
    onDelete, 
    onArrowUp,
    onArrowDown,
    content 
}, ref) => {
    
    const internalRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            internalRef.current.innerHTML = content;
        }
    }, [content]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
            return;
        }

        if (e.key === 'Backspace') {
            const isCursorAtStart = isCursorAtStartOfParagraph();
            if (e.currentTarget.textContent?.trim() === '' && isCursorAtStart) {
                e.preventDefault();
                onDelete();
            }
            return;
        }

        if (e.key === 'ArrowUp') {
            console.log("Up Arrow");
            if (isCursorAtTopOfParagraph()) {
                console.log("Changing");
                e.preventDefault();
                onArrowUp();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            console.log("Down Arrow");
            if (isCursorAtBottomOfParagraph()) {
                e.preventDefault();
                console.log("Changing");
                onArrowDown();
            }
            return;
        }
    };

    const isCursorAtTopOfParagraph = (): boolean => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !internalRef.current) return false;
        
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        
        // Get the cursor's current Y position
        const cursorRect = range.getBoundingClientRect();
        if (cursorRect.height === 0) {
            // For empty paragraphs or certain edge cases
            const compareRange = document.createRange();
            compareRange.selectNodeContents(internalRef.current);
            compareRange.collapse(true);
            return range.compareBoundaryPoints(Range.START_TO_START, compareRange) === 0;
        }
        
        // Get the paragraph's bounding rect
        const paragraphRect = internalRef.current.getBoundingClientRect();
        
        // Consider it at top if cursor is within the first line's height
        // We add a small threshold to account for line height differences
        return cursorRect.top <= paragraphRect.top + 2;
    };

    const isCursorAtBottomOfParagraph = (): boolean => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !internalRef.current) return false;
        
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        
        // Get the cursor's current Y position
        const cursorRect = range.getBoundingClientRect();
        if (cursorRect.height === 0) {
            // For empty paragraphs or certain edge cases
            const compareRange = document.createRange();
            compareRange.selectNodeContents(internalRef.current);
            compareRange.collapse(false);
            return range.compareBoundaryPoints(Range.END_TO_END, compareRange) === 0;
        }
        
        // Get the paragraph's bounding rect
        const paragraphRect = internalRef.current.getBoundingClientRect();
        
        // Consider it at bottom if cursor is within the last line's height
        // We subtract a small threshold to account for line height differences
        return cursorRect.bottom >= paragraphRect.bottom - 2;
    };

    const isCursorAtStartOfParagraph = (): boolean => {
        const selection = window.getSelection();
        return selection?.anchorOffset === 0;
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
        internalRef.current = el;
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
            onFocus={onFocus}
        />
    );
});

Paragraph.displayName = "Paragraph";
export default Paragraph;