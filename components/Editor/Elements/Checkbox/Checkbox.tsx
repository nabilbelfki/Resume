"use client"
import React, { useState, useRef, useEffect, KeyboardEvent, forwardRef } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxItem {
  id: number;
  checked: boolean;
  content: string;
}

interface CheckboxProps {
  editable: boolean;
  onEmptyEnter?: () => void;
  onEmptyBackspace?: () => void;
  onFocus?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(({ 
  editable, 
  onEmptyEnter = () => {}, 
  onEmptyBackspace = () => {}, 
  onFocus = () => {},
  onArrowUp = () => {},
  onArrowDown = () => {}
}, ref) => {
  const [items, setItems] = useState<CheckboxItem[]>([
    { id: Date.now(), checked: false, content: "" }
  ]);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const internalRef = useRef<HTMLDivElement>(null);
  const lastCursorOffset = useRef<number>(0);

  const refToUse = (el: HTMLDivElement | null) => {
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
    internalRef.current = el;
  };

  const saveCursorOffset = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (!range.collapsed) return;
    
    lastCursorOffset.current = range.startOffset;
  };

  const restoreCursorOffset = (element: HTMLElement, offset: number) => {
    const selection = window.getSelection();
    if (!selection) return;

    const textContent = element.textContent || '';
    const adjustedOffset = Math.min(offset, textContent.length);
    
    const range = document.createRange();
    const textNode = findFirstTextNode(element);
    
    if (textNode) {
      range.setStart(textNode, adjustedOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const findFirstTextNode = (node: Node): Text | null => {
    if (node.nodeType === Node.TEXT_NODE) return node as Text;
    
    for (let i = 0; i < node.childNodes.length; i++) {
      const found = findFirstTextNode(node.childNodes[i]);
      if (found) return found;
    }
    
    return null;
  };

  useEffect(() => {
    if (focusedId !== null && itemRefs.current[focusedId]) {
      const element = itemRefs.current[focusedId];
      element.focus();
      restoreCursorOffset(element, lastCursorOffset.current);
      setFocusedId(null);
    }
  }, [focusedId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const isContentEmpty = e.currentTarget.textContent?.trim() === "";
    const isCursorAtStart = window.getSelection()?.anchorOffset === 0;

    // Save cursor position before any navigation
    saveCursorOffset();

    // Handle Backspace on empty checkbox
    if (e.key === "Backspace" && isContentEmpty && isCursorAtStart) {
      e.preventDefault();
      if (items.length === 1) {
        onEmptyBackspace();
      } else {
        setItems(prev => prev.filter((_, i) => i !== index));
        setFocusedId(items[Math.max(0, index - 1)].id);
      }
      return;
    }

    // Handle Enter
    if (e.key === "Enter") {
      e.preventDefault();
      
      if (isContentEmpty) {
        if (items.length === 1) {
          onEmptyBackspace();
        } else {
          setItems(prev => prev.filter((_, i) => i !== index));
          onEmptyEnter();
        }
        return;
      }

      const newId = Date.now();
      setItems(prev => [
        ...prev.slice(0, index + 1),
        { id: newId, checked: false, content: "" },
        ...prev.slice(index + 1)
      ]);
      setFocusedId(newId);
    }
    // Handle Arrow Up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        onArrowUp();
      } else {
        setFocusedId(items[index - 1].id);
      }
    }
    // Handle Arrow Down
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (index === items.length - 1) {
        onArrowDown();
      } else {
        setFocusedId(items[index + 1].id);
      }
    }
  };

  const handleBlur = (index: number, content: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, content } : item
    ));
  };

  const toggleCheckbox = (index: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className={styles.checkboxes} ref={refToUse}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.checkbox}>
          <input
            type="checkbox"
            className={styles.input}
            checked={item.checked}
            onChange={() => toggleCheckbox(index)}
          />
          <div
            ref={el => {
              if (el) itemRefs.current[item.id] = el;
              else delete itemRefs.current[item.id];
            }}
            contentEditable={editable}
            onFocus={onFocus}
            className={styles.label}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onBlur={(e) => handleBlur(index, e.currentTarget.textContent || "")}
            suppressContentEditableWarning={true}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;