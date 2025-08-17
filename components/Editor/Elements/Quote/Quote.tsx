import styles from "./Quote.module.css";
import React, { useRef, useEffect } from "react";

interface QuoteProps {
  editable: boolean;
  content: string;
  textAlign?: 'left' | 'center' | 'right';
  onFocus: () => void;
  onContentUpdate: (content: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
}

const Quote = React.forwardRef<HTMLSpanElement, QuoteProps>(({
  editable,
  content,
  textAlign = 'center',
  onFocus,
  onContentUpdate,
  onDelete,
  onEnter,
  onArrowUp,
  onArrowDown
}, ref) => {
  const internalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (internalRef.current && content !== internalRef.current.innerHTML) {
      internalRef.current.innerHTML = content;
    }
  }, [content]);

  const isCursorAtTopOfElement = (): boolean => {
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
    
    const firstRange = document.createRange();
    firstRange.selectNodeContents(textNodes[0]);
    firstRange.collapse(true);
    const firstLineRect = firstRange.getBoundingClientRect();
    
    return cursorRect.top <= firstLineRect.bottom;
  };

  const isCursorAtBottomOfElement = (): boolean => {
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
    
    const lastRange = document.createRange();
    lastRange.selectNodeContents(textNodes[textNodes.length - 1]);
    lastRange.collapse(false);
    const lastLineRect = lastRange.getBoundingClientRect();
    
    return cursorRect.bottom >= lastLineRect.top;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    } 
    else if (e.key === 'Backspace') {
      if (e.currentTarget.textContent?.trim() === '') {
        e.preventDefault();
        onDelete();
      }
    }
    else if (e.key === 'ArrowUp') {
      if (isCursorAtTopOfElement()) {
        e.preventDefault();
        onArrowUp();
      }
    }
    else if (e.key === 'ArrowDown') {
      if (isCursorAtBottomOfElement()) {
        e.preventDefault();
        onArrowDown();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    onContentUpdate(e.currentTarget.innerHTML);
  };

  const refToUse = (el: HTMLSpanElement | null) => {
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLSpanElement | null>).current = el;
    }
    internalRef.current = el;
  };

  return (
    <div className={styles.quote} style={{ textAlign }}>
      <span className={styles.quoteMark}>"</span>
      <span 
        ref={refToUse}
        className={styles.text}
        contentEditable={editable}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        suppressContentEditableWarning={true}
      />
      <span className={styles.quoteMark}>"</span>
    </div>
  );
});

Quote.displayName = "Quote";
export default Quote;