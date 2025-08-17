"use client";
import React, { useRef } from "react";
import styles from "./ColorPicker.module.css";
import Image from "next/image";

interface ColorPickerProps {
  ID: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  ID, 
  placeholder = '', 
  value, 
  onChange,
  style = {}
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorWheelClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = event.target.value;
    onChange(newHexColor.toUpperCase());
  };

  return (
    <div 
      className={`${styles.container} ${placeholder ? styles['field-included'] : '' }`}
      onClick={handleColorWheelClick}
      style={style}
    >
      {placeholder && (<input 
        type="text" 
        id={ID}
        placeholder={placeholder}
        value={value || ''}
        readOnly
      />)}
      <div className={styles.picker}>
        <input 
          type="color" 
          ref={colorInputRef}
          onChange={handleColorInputChange}
          value={value || '#000000'} 
          className={styles['hidden-color-input']}
        />
      </div>
      <div className={styles['color-wheel']}>
        {value ? (
          <div 
            className={styles['color-swatch']}
            style={{ backgroundColor: value }}
          ></div>
        ) : (
          <Image 
            src='/images/color-wheel.png' 
            alt='Image of a color wheel' 
            width={30} 
            height={30}
          />
        )}
      </div>
    </div>
  );
};

export default ColorPicker;