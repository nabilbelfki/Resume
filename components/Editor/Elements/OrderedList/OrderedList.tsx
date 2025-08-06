// in OrderedList.tsx

import React, { useState, useRef, useEffect } from "react";
import styles from "./OrderedList.module.css";

interface ListItem {
  id: number;
  content: string;
  level: number;
}

interface OrderedListProps {
  initialItems?: ListItem[];
  textAlign?: 'left' | 'center' | 'right';
  onEmptyEnter: () => void;
  onEmptyBackspace: () => void;
  focusOnItem?: number | 'last';
}

const OrderedList: React.FC<OrderedListProps> = ({ initialItems = [{ id: Date.now(), content: "", level: 0 }], textAlign = 'left', onEmptyEnter, onEmptyBackspace, focusOnItem }) => {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement }>({});

  useEffect(() => {
    // This useEffect now handles both internal and external focus requests
    if (focusOnItem === 'last' && items.length > 0) {
        const lastItem = items[items.length - 1];
        setFocusedId(lastItem.id);
    } else if (focusedId !== null && itemRefs.current[focusedId]) {
      const element = itemRefs.current[focusedId];
      element.focus();

      const selection = window.getSelection();
      if (selection) { 
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setFocusedId(null);
    }
  }, [focusedId, focusOnItem, items]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    const isCursorAtStart = window.getSelection()?.anchorOffset === 0;
    const isContentEmpty = e.currentTarget.textContent?.trim() === '';

    // Handle Backspace on a single empty li
    if (e.key === 'Backspace' && isContentEmpty && isCursorAtStart) {
      if (items.length === 1) {
        e.preventDefault();
        onEmptyBackspace();
        return;
      }
      // If there are multiple items, remove the current one and focus on the previous
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
      
      // If a single empty li, delete the whole block and add a paragraph
      if (isContentEmpty && items.length === 1) {
          onEmptyBackspace();
          return;
      }

      // If an empty li in a list with more than one item, remove the li and add a paragraph
      if (isContentEmpty && items.length > 1) {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onEmptyEnter();
        return;
      }
      
      // Default behavior: add a new li
      const newId = Date.now();
      const newItems = [...items];
      newItems.splice(index + 1, 0, { id: newId, content: '', level: items[index].level });
      setItems(newItems);
      setFocusedId(newId);
    } else if (e.key === 'Tab') {
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
  };

  const handleBlur = (e: React.FocusEvent<HTMLLIElement>, index: number) => {
    const newItems = [...items];
    newItems[index].content = e.currentTarget.innerHTML;
    setItems(newItems);
  };

  return (
    <ol className={styles.list} style={{ textAlign }}>
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
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={(e) => handleBlur(e, index)}
        >
          {item.content}
        </li>
      ))}
    </ol>
  );
};

export default OrderedList;