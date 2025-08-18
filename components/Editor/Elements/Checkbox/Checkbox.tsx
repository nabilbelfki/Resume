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
  content?: string; // New prop for controlled content
  onContentUpdate?: (content: string) => void; // New callback
  onEmptyEnter?: () => void;
  onEmptyBackspace?: () => void;
  onFocus?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}

// Helper to parse content string to CheckboxItem[]
const parseContent = (content?: string): CheckboxItem[] => {
  if (!content) return [{ id: Date.now(), checked: false, content: "" }];
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.every(item => 
      typeof item.id === 'number' && 
      typeof item.checked === 'boolean' && 
      typeof item.content === 'string'
    )) {
      return parsed;
    }
    return [{ id: Date.now(), checked: false, content: "" }];
  } catch {
    return [{ id: Date.now(), checked: false, content: "" }];
  }
};

// Helper to serialize CheckboxItem[] to string
const serializeContent = (items: CheckboxItem[]): string => {
  return JSON.stringify(items);
};

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(({ 
  editable, 
  content,
  onContentUpdate = () => {},
  onEmptyEnter = () => {}, 
  onEmptyBackspace = () => {}, 
  onFocus = () => {},
  onArrowUp = () => {},
  onArrowDown = () => {}
}, ref) => {
  const [items, setItems] = useState<CheckboxItem[]>(parseContent(content));
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const internalRef = useRef<HTMLDivElement>(null);
  const lastCursorOffset = useRef<number>(0);

  // Update internal state when content prop changes
  useEffect(() => {
    setItems(parseContent(content));
  }, [content]);

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

  const updateItems = (newItems: CheckboxItem[]) => {
    setItems(newItems);
    onContentUpdate(serializeContent(newItems));
  };

const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    console.log("Key", e.key)
    const isContentEmpty = e.currentTarget.textContent?.trim() === "";
    const isCursorAtStart = window.getSelection()?.anchorOffset === 0;

    saveCursorOffset();

    if (e.key === "Backspace" && isContentEmpty && isCursorAtStart) {
      e.preventDefault();
      if (items.length === 1) {
        onEmptyBackspace();
      } else {
        const newItems = items.filter((_, i) => i !== index);
        updateItems(newItems);
        setFocusedId(items[Math.max(0, index - 1)].id);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      
      if (isContentEmpty) {
        if (items.length === 1) {
          onEmptyBackspace();
        } else {
          const newItems = items.filter((_, i) => i !== index);
          updateItems(newItems);
          onEmptyEnter();
        }
        return;
      }

      const newId = Date.now();
      const newItems = [
        ...items.slice(0, index + 1),
        { id: newId, checked: false, content: "" },
        ...items.slice(index + 1)
      ];
      updateItems(newItems);
      setFocusedId(newId);
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        onArrowUp();
      } else {
        setFocusedId(items[index - 1].id);
      }
    }
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
    const newItems = items.map((item, i) => 
      i === index ? { ...item, content } : item
    );
    updateItems(newItems);
  };

  const toggleCheckbox = (index: number) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    updateItems(newItems);
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