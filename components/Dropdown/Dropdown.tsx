import React, { useState, useEffect, useRef } from "react";
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
  disabled?: boolean;
  style?: Styles;
}
interface Styles {
  container?: React.CSSProperties;
  button?: React.CSSProperties;
  dropdown?: React.CSSProperties;
  option?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  placeholder, 
  options, 
  value,
  onChange,
  disabled = false,
  style = {},
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [buttonText, setButtonText] = useState(placeholder);
  const [color, setColor] = useState<'#C6C6C6' | '#4C4C4C'>(disabled ? '#C6C6C6' : '#4C4C4C');

  useEffect(() => {
    // Update button text when value changes
    if (value === null) {
      setButtonText(placeholder);
      setColor(disabled ? '#C6C6C6' : '#C6C6C6');
    } else {
      // console.log('Value', value)

      const selectedOption = options.find(option => option.value === value);
      // console.log(selectedOption)
      if (selectedOption) {
        setButtonText(selectedOption.label);
        setColor(disabled ? '#C6C6C6' : '#4C4C4C');
      }
    }
  }, [value, options, placeholder, disabled]);

  // useEffect to handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the dropdown if it's open and the click is outside the container
      if (isExpanded && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    // Add the event listener when the component mounts or isExpanded changes
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts or isExpanded changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]); // Re-run effect when isExpanded changes

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    if (value === optionValue) {
      onChange(null); // Deselect if clicking the same option
    } else {
      onChange(optionValue); // Select new option
    }
    setIsExpanded(false);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container} style={style.container} ref={dropdownRef}>
      <button  style={style.button}
        className={`${styles.display} ${disabled ? styles.disabled : ''}`} 
        onClick={toggleDropdown}
        type="button" // Prevent form submission
        disabled={disabled}
      >
        <span style={{ color }}>{buttonText}</span>
        
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 6 3" fill="none">
          <path d="M1 0.5L3 2.5L5 0.5" stroke="#4C4C4C" strokeWidth="0.5"/>
        </svg>
      </button>
      {isExpanded && !disabled && (
        <div className={styles.dropdown} style={style.dropdown}>
          {options.map((option) => (
            <button style={style.option}
              key={option.value}
              className={value === option.value 
                ? `${styles.option} ${styles.selected}` 
                : styles.option
              }
              onClick={() => handleOptionClick(option.value)}
              type="button"
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