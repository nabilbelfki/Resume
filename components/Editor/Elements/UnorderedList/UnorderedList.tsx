import React, { useState, useRef, useEffect, forwardRef } from "react";
import styles from "./UnorderedList.module.css";

interface ListItem {
  id: number;
  content: string;
  level: number;
}

interface UnorderedListProps {
  initialItems?: ListItem[];
  textAlign?: 'left' | 'center' | 'right';
  onEmptyEnter: () => void;
  onEmptyBackspace: () => void;
  onFocus: () => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
  focusOnItem?: number | 'last';
  content?: string;
  onContentUpdate?: (content: string) => void;
}

const UnorderedList = forwardRef<HTMLUListElement, UnorderedListProps>(({ 
  initialItems = [{ id: Date.now(), content: "", level: 0 }], 
  textAlign = 'left', 
  onEmptyEnter, 
  onEmptyBackspace, 
  onFocus,
  onArrowUp,
  onArrowDown,
  focusOnItem,
  content,
  onContentUpdate
}, ref) => {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement }>({});
  const internalRef = useRef<HTMLUListElement>(null);
  const lastCursorOffset = useRef<number>(0);

  const refToUse = (el: HTMLUListElement | null) => {
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLUListElement | null>).current = el;
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
    if (focusOnItem === 'last' && items.length > 0) {
      const lastItem = items[items.length - 1];
      setFocusedId(lastItem.id);
    } else if (focusedId !== null && itemRefs.current[focusedId]) {
      const element = itemRefs.current[focusedId];
      element.focus();
      restoreCursorOffset(element, lastCursorOffset.current);
      setFocusedId(null);
    }
  }, [focusedId, focusOnItem, items]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    const isCursorAtStart = window.getSelection()?.anchorOffset === 0;
    const isContentEmpty = e.currentTarget.textContent?.trim() === '';

    // Save cursor position before any navigation
    saveCursorOffset();

    // Handle Backspace on a single empty li
    if (e.key === 'Backspace' && isContentEmpty && isCursorAtStart) {
      if (items.length === 1) {
        e.preventDefault();
        onEmptyBackspace();
        return;
      }
      e.preventDefault();
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      if (index > 0) {
        setFocusedId(items[index - 1].id);
      }
      return;
    }
    
    // Handle Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (isContentEmpty && items.length === 1) {
          onEmptyBackspace();
          return;
      }

      if (isContentEmpty && items.length > 1) {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onEmptyEnter();
        return;
      }
      
      const newId = Date.now();
      const newItems = [...items];
      newItems.splice(index + 1, 0, { id: newId, content: '', level: items[index].level });
      setItems(newItems);
      setFocusedId(newId);
    } 
    // Handle Tab for indentation
    else if (e.key === 'Tab') {
      e.preventDefault();
      const newItems = [...items];
      if (e.shiftKey) {
        if (newItems[index].level > 0) {
            newItems[index].level -= 1;
        }
      } else {
        newItems[index].level += 1;
      }
      setItems(newItems);
    }
    // Handle Arrow Up
    else if (e.key === 'ArrowUp') {
      if (index === 0) {
        e.preventDefault();
        onArrowUp();
      } else {
        e.preventDefault();
        setFocusedId(items[index - 1].id);
      }
    }
    // Handle Arrow Down
    else if (e.key === 'ArrowDown') {
      if (index === items.length - 1) {
        e.preventDefault();
        onArrowDown();
      } else {
        e.preventDefault();
        setFocusedId(items[index + 1].id);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLLIElement>, index: number) => {
    const newItems = [...items];
    newItems[index].content = e.currentTarget.innerHTML;
    setItems(newItems);
  };

  return (
    <ul 
      ref={refToUse}
      className={styles.list} 
      style={{ textAlign }}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          ref={el => {
            if (el) {
              itemRefs.current[item.id] = el;
            } else {
              delete itemRefs.current[item.id];
            }
          }}
          className={styles.listItem}
          style={{ marginLeft: `${item.level * 20}px` }}
          contentEditable={true}
          onFocus={onFocus}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={(e) => handleBlur(e, index)}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
});

UnorderedList.displayName = "UnorderedList";
export default UnorderedList;