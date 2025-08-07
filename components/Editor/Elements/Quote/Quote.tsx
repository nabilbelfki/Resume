import styles from "./Quote.module.css"
import React, { useRef, useEffect, useState } from "react";

interface QuoteProps {
  editable: boolean;
  content: string;
  textAlign?: 'left' | 'center' | 'right';
  onFocus: () => void;
  onContentUpdate: (content: string) => void;
  onDelete: () => void;
  onEnter: () => void;
}

const Quote = React.forwardRef<HTMLSpanElement, QuoteProps>(({
  editable,
  content,
  textAlign = 'center',
  onFocus,
  onContentUpdate,
  onDelete,
  onEnter
}, ref) => {
  const internalRef = useRef<HTMLSpanElement>(null);

  // Sync content with the internal ref
  useEffect(() => {
    if (internalRef.current && content !== internalRef.current.innerHTML) {
      internalRef.current.innerHTML = content;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    } 
    else if (e.key === 'Backspace') {
      const isCursorAtStart = window.getSelection()?.anchorOffset === 0;
      if (e.currentTarget.textContent?.trim() === '' && isCursorAtStart) {
        e.preventDefault();
        onDelete();
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
    (internalRef as React.MutableRefObject<HTMLSpanElement | null>).current = el;
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