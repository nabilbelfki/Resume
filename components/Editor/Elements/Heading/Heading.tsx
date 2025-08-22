import React, { useRef, useEffect } from "react";
import styles from "./Heading.module.css";

interface HeadingProps {
    heading?: 2 | 3 | 4 | 5 | 6;
    textAlign?: 'left' | 'center' | 'right'; 
    editable: boolean;
    onEnter: () => void;
    onContentUpdate: (content: string) => void;
    onDelete: () => void;
    onFocus: () => void;
    onArrowUp: () => void;
    onArrowDown: () => void;
    content: string;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ 
    editable, 
    heading = 2, 
    textAlign = 'left',
    onEnter,
    onContentUpdate,
    onDelete,
    onFocus,
    onArrowUp,
    onArrowDown,
    content
}, ref) => {
    const internalRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            internalRef.current.innerHTML = content;
        }
    }, [content]);

    const isCursorAtTopOfHeading = (): boolean => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !internalRef.current) return false;
        
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        
        // Get the line rectangle of the current cursor position
        const cursorRect = range.getBoundingClientRect();
        if (cursorRect.height === 0) return false; // No visible cursor
        
        // Get all text nodes in the heading
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(
            internalRef.current,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node as Text);
        }
        
        if (textNodes.length === 0) return false;
        
        // Check if we're on the first line by comparing with first text node's position
        const firstRange = document.createRange();
        firstRange.selectNodeContents(textNodes[0]);
        firstRange.collapse(true);
        const firstLineRect = firstRange.getBoundingClientRect();
        
        return cursorRect.top <= firstLineRect.bottom;
    };

    const isCursorAtBottomOfHeading = (): boolean => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !internalRef.current) return false;
        
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        
        const cursorRect = range.getBoundingClientRect();
        if (cursorRect.height === 0) return false;
        
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(
            internalRef.current,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node as Text);
        }
        
        if (textNodes.length === 0) return false;
        
        // Check if we're on the last line by comparing with last text node's position
        const lastRange = document.createRange();
        lastRange.selectNodeContents(textNodes[textNodes.length - 1]);
        lastRange.collapse(false);
        const lastLineRect = lastRange.getBoundingClientRect();
        
        return cursorRect.bottom >= lastLineRect.top;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
            return;
        }

        if (e.key === 'Backspace') {
            // const isCursorAtStart = isCursorAtTopOfHeading();
            if (e.currentTarget.textContent?.trim() === '') {
                e.preventDefault();
                onDelete();
            }
            return;
        }

        if (e.key === 'ArrowUp') {
            if (isCursorAtTopOfHeading()) {
                e.preventDefault();
                onArrowUp();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            if (isCursorAtBottomOfHeading()) {
                e.preventDefault();
                onArrowDown();
            }
            return;
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
        internalRef.current = el;
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
            onFocus={onFocus}
        />
    );
});

Heading.displayName = "Heading";
export default Heading;