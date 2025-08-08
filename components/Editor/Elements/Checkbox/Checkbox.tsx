"use client"
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
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
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  editable, 
  onEmptyEnter = () => {}, 
  onEmptyBackspace = () => {}, 
  onFocus = () => {} 
}) => {
  const [items, setItems] = useState<CheckboxItem[]>([
    { id: Date.now(), checked: false, content: "" }
  ]);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLDivElement }>({});

  useEffect(() => {
    if (focusedId !== null && itemRefs.current[focusedId]) {
      const element = itemRefs.current[focusedId];
      element.focus();
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      setFocusedId(null);
    }
  }, [focusedId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const isContentEmpty = e.currentTarget.textContent?.trim() === "";
    const isCursorAtStart = window.getSelection()?.anchorOffset === 0;

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
    <div className={styles.checkboxes}>
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
};

export default Checkbox;