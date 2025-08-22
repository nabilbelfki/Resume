"use client"
import React, { useState, useRef, useEffect, KeyboardEvent, forwardRef } from "react";
import styles from "./OrderedList.module.css";

interface ListItem {
  id: number;
  content: string;
  level: number;
}

interface OrderedListProps {
  editable: boolean;
  content?: string;
  onContentUpdate?: (content: string) => void;
  onEmptyEnter?: () => void;
  onEmptyBackspace?: () => void;
  onFocus?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}

// Helper to parse content string to ListItem[]
const parseContent = (content?: string): ListItem[] => {
  console.log("Content", content);
  if (!content) return [{ id: Date.now(), content: "", level: 0 }];
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.every(item => 
      typeof item.id === 'number' && 
      typeof item.content === 'string' &&
      typeof item.level === 'number'
    )) {
      return parsed;
    }
    return [{ id: Date.now(), content: "", level: 0 }];
  } catch {
    return [{ id: Date.now(), content: "", level: 0 }];
  }
};

// Helper to serialize ListItem[] to string
const serializeContent = (items: ListItem[]): string => {
  return JSON.stringify(items);
};

const OrderedList = forwardRef<HTMLOListElement, OrderedListProps>(({ 
  editable, 
  content,
  onContentUpdate = () => {},
  onEmptyEnter = () => {}, 
  onEmptyBackspace = () => {}, 
  onFocus = () => {},
  onArrowUp = () => {},
  onArrowDown = () => {}
}, ref) => {
  const [items, setItems] = useState<ListItem[]>(parseContent(content));
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement }>({});
  const internalRef = useRef<HTMLOListElement>(null);
  const lastCursorOffset = useRef<number>(0);

  // Update internal state when content prop changes
  useEffect(() => {
    console.log("Content", content)
    setItems(parseContent(content));
  }, [content]);

  const refToUse = (el: HTMLOListElement | null) => {
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLOListElement | null>).current = el;
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

  const updateItems = (newItems: ListItem[]) => {
    setItems(newItems);
    onContentUpdate(serializeContent(newItems));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, index: number) => {
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
        { id: newId, content: "", level: items[index].level },
        ...items.slice(index + 1)
      ];
      updateItems(newItems);
      setFocusedId(newId);
    }
    else if (e.key === "Tab") {
      e.preventDefault();
      const newItems = [...items];
      if (e.shiftKey) {
        // Shift+Tab - decrease indentation
        if (newItems[index].level > 0) {
          newItems[index].level -= 1;
        }
      } else {
        // Tab - increase indentation
        newItems[index].level += 1;
      }
      updateItems(newItems);
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

  return (
    <ol className={styles.list} ref={refToUse}>
      {items.map((item, index) => (
        <li
          key={item.id}
          ref={el => {
            if (el) itemRefs.current[item.id] = el;
            else delete itemRefs.current[item.id];
          }}
          className={styles.listItem}
          style={{ marginLeft: `${item.level * 20}px` }}
          contentEditable={editable}
          onFocus={onFocus}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={(e) => handleBlur(index, e.currentTarget.textContent || "")}
          suppressContentEditableWarning={true}
        >
          {item.content}
        </li>
      ))}
    </ol>
  );
});

OrderedList.displayName = "OrderedList";
export default OrderedList;