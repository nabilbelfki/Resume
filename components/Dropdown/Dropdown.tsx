import React, { useState, useEffect } from "react";
import styles from "./Dropdown.module.css";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  placeholder, 
  options, 
  value,
  onChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [buttonText, setButtonText] = useState(placeholder);
  const [color, setColor] = useState<'#C6C6C6' | '#4C4C4C'>('#C6C6C6');

  useEffect(() => {
    // Update button text when value changes
    if (value === null) {
      setButtonText(placeholder);
      setColor('#C6C6C6');
    } else {
      const selectedOption = options.find(option => option.value === value);
      if (selectedOption) {
        setButtonText(selectedOption.label);
        setColor('#4C4C4C');
      }
    }
  }, [value, options, placeholder]);

  const handleOptionClick = (optionValue: string) => {
    if (value === optionValue) {
      onChange(null); // Deselect if clicking the same option
    } else {
      onChange(optionValue); // Select new option
    }
    setIsExpanded(false);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.display} 
        onClick={() => setIsExpanded(!isExpanded)}
        type="button" // Prevent form submission
      >
        <span style={{ color }}>{buttonText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 6 3" fill="none">
          <path d="M1 0.5L3 2.5L5 0.5" stroke="#4C4C4C" strokeWidth="0.5"/>
        </svg>
      </button>
      {isExpanded && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className={value === option.value 
                ? `${styles.option} ${styles.selected}` 
                : styles.option
              }
              onClick={() => handleOptionClick(option.value)}
              type="button" // Prevent form submission
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;