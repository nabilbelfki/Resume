"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from "./Delimiter.module.css"
import ColorPicker from '@/components/ColorPicker/ColorPicker';
import Dropdown from "@/components/Dropdown/Dropdown";

const colors = ['#d1d5db', '#3b82f6', '#ef4444', '#10b981'];
const stylesOptions = ['solid', 'dashed', 'dotted'];

interface DelimiterProps {
  initialColor?: string;
  initialStyle?: 'solid' | 'dashed' | 'dotted';
  initialDashLength?: number;
  initialThickness?: number;
  onContentUpdate: (
    color: string,
    style: 'solid' | 'dashed' | 'dotted',
    dashLength: number,
    thickness: number,
  ) => void;
  onDelete: () => void;
  onEnter: () => void;
}

const Delimiter: React.FC<DelimiterProps> = ({
  initialColor = colors[0],
  initialStyle = stylesOptions[0],
  initialDashLength = 4,
  initialThickness = 2,
  onContentUpdate,
  onDelete,
  onEnter,
}) => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(initialColor);
  const [style, setStyle] = useState(initialStyle);
  const [dashLength, setDashLength] = useState(initialDashLength);
  const [thickness, setThickness] = useState(initialThickness);

  // Handles clicks outside the component to hide the toolbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsToolbarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToolbarVisible(true);
  };
  
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onContentUpdate(newColor, style as 'solid' | 'dashed' | 'dotted', dashLength, thickness);
  };

  const handleStyleChange = (newStyle: 'solid' | 'dashed' | 'dotted') => {
    setStyle(newStyle);
    onContentUpdate(color, newStyle, dashLength, thickness);
  };

  const handleDashLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDashLength = parseFloat(e.target.value);
    setDashLength(newDashLength);
    onContentUpdate(color, style as 'solid' | 'dashed' | 'dotted', newDashLength, thickness);
  };

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newThickness = parseFloat(e.target.value);
    setThickness(newThickness);
    onContentUpdate(color, style as 'solid' | 'dashed' | 'dotted', dashLength, newThickness);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      onDelete();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  const getLineStyle = () => {
    if (style === 'solid') {
      return {
        height: `${thickness}px`,
        backgroundColor: color,
      };
    }

    const gradient = style === 'dashed'
      ? `repeating-linear-gradient(90deg, ${color}, ${color} ${dashLength}px, transparent ${dashLength}px, transparent ${dashLength * 2}px)`
      : `radial-gradient(circle at center, ${color} ${dashLength}px, transparent ${dashLength}px)`;

    return {
      height: `${thickness}px`,
      backgroundImage: gradient,
      backgroundSize: style === 'dotted' ? `${dashLength * 2}px ${thickness}px` : '100% 100%',
    };
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onClick={handleLineClick}
    >
      <div className={styles.line} style={{ ...getLineStyle() }} />
      {isToolbarVisible && (
        <div className={styles.toolbar} onClick={e => e.stopPropagation()}>
          
          <ColorPicker ID={'colorbook'} value={color} onChange={(value) => handleColorChange(value)} />
          <Dropdown 
            placeholder='Choose Type'
            value={style}
            onChange={(value) => handleStyleChange(value as 'solid' | 'dashed' | 'dotted')}
            options={[
              { label: 'Solid',value: 'solid' },
              { label: 'Dashed', value: 'dashed' }
            ]}
            style={{
              button: {
                height: 40,
                padding: 15
              }
            }
            }
          />
          <div className={styles.number}>
            <label htmlFor="thickness">Thickness</label>
            <input 
              type="number"
              value={thickness}
              id="thickness"
              onChange={handleThicknessChange}
              />
          </div>
          <div className={styles.number}>
            <label htmlFor="dash">Dash</label>
            <input 
              type="number" 
              id="dash" 
              value={style === 'dashed' ? dashLength : ''}
              disabled={ style !== 'dashed' }
              onChange={handleDashLengthChange}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default Delimiter;