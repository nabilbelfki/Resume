"use client";
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import styles from "./Delimiter.module.css"
import ColorPicker from '@/components/ColorPicker/ColorPicker';
import Dropdown from "@/components/Dropdown/Dropdown";

const colors = ['#d1d5db', '#3b82f6', '#ef4444', '#10b981'];
const stylesOptions = ['solid', 'dashed', 'dotted'];

interface DelimiterProps {
  editable?: boolean;
  content?: string;
  onContentUpdate?: (content: string) => void;
  onDelete?: () => void;
  onEnter?: () => void;
  initialColor?: string;
  initialStyle?: 'solid' | 'dashed' | 'dotted';
  initialDashLength?: number;
  initialThickness?: number;
}

interface DelimiterContent {
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  dashLength: number;
  thickness: number;
}

// Helper to parse content string to DelimiterContent
const parseContent = (content?: string): DelimiterContent => {
  if (!content) return {
    color: colors[0],
    style: stylesOptions[0] as 'solid' | 'dashed' | 'dotted',
    dashLength: 4,
    thickness: 2
  };
  
  try {
    const parsed = JSON.parse(content);
    if (parsed && 
        typeof parsed.color === 'string' && 
        ['solid', 'dashed', 'dotted'].includes(parsed.style) &&
        typeof parsed.dashLength === 'number' &&
        typeof parsed.thickness === 'number'
    ) {
      return parsed;
    }
    return {
      color: colors[0],
      style: stylesOptions[0] as 'solid' | 'dashed' | 'dotted',
      dashLength: 4,
      thickness: 2
    };
  } catch {
    return {
      color: colors[0],
      style: stylesOptions[0] as 'solid' | 'dashed' | 'dotted',
      dashLength: 4,
      thickness: 2
    };
  }
};

// Helper to serialize DelimiterContent to string
const serializeContent = (content: DelimiterContent): string => {
  return JSON.stringify(content);
};

const Delimiter = forwardRef<HTMLDivElement, DelimiterProps>(({
  editable = true,
  content,
  onContentUpdate = () => {},
  onDelete = () => {},
  onEnter = () => {},
  initialColor = colors[0],
  initialStyle = stylesOptions[0] as 'solid' | 'dashed' | 'dotted',
  initialDashLength = 4,
  initialThickness = 2,
}, ref) => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial content or use defaults
  const parsedContent = parseContent(content);
  const [color, setColor] = useState(parsedContent.color || initialColor);
  const [style, setStyle] = useState(parsedContent.style || initialStyle);
  const [dashLength, setDashLength] = useState(parsedContent.dashLength || initialDashLength);
  const [thickness, setThickness] = useState(parsedContent.thickness || initialThickness);

  // Update internal state when content prop changes
  useEffect(() => {
    const parsed = parseContent(content);
    setColor(parsed.color);
    setStyle(parsed.style);
    setDashLength(parsed.dashLength);
    setThickness(parsed.thickness);
  }, [content]);

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
    if (!editable) return;
    e.stopPropagation();
    setIsToolbarVisible(true);
  };
  
  const updateContent = (newColor: string, newStyle: 'solid' | 'dashed' | 'dotted', newDashLength: number, newThickness: number) => {
    const newContent = {
      color: newColor,
      style: newStyle,
      dashLength: newDashLength,
      thickness: newThickness
    };
    onContentUpdate(serializeContent(newContent));
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateContent(newColor, style, dashLength, thickness);
  };

  const handleStyleChange = (newStyle: 'solid' | 'dashed' | 'dotted') => {
    setStyle(newStyle);
    updateContent(color, newStyle, dashLength, thickness);
  };

  const handleDashLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDashLength = parseFloat(e.target.value);
    setDashLength(newDashLength);
    updateContent(color, style, newDashLength, thickness);
  };

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newThickness = parseFloat(e.target.value);
    setThickness(newThickness);
    updateContent(color, style, dashLength, newThickness);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editable) return;
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
      tabIndex={editable ? 0 : -1}
      onClick={handleLineClick}
    >
      <div className={styles.line} style={{ ...getLineStyle() }} />
      {editable && isToolbarVisible && (
        <div className={styles.toolbar} onClick={e => e.stopPropagation()}>
          <ColorPicker ID={'colorbook'} value={color} onChange={handleColorChange} />
          <Dropdown 
            placeholder='Choose Type'
            value={style}
            onChange={(value) => handleStyleChange(value as 'solid' | 'dashed' | 'dotted')}
            options={[
              { label: 'Solid', value: 'solid' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Dotted', value: 'dotted' }
            ]}
            style={{
              button: {
                height: 40,
                padding: 15
              }
            }}
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
              disabled={style !== 'dashed'}
              onChange={handleDashLengthChange}
            />
          </div>
          <button className={styles.delete} onClick={onDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={25}>
              <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

Delimiter.displayName = "Delimiter";
export default Delimiter;