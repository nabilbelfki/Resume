"use client";
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, style, disabled = false }) => {
  
  return (
    <button 
      className={styles["sleek-blue"]} 
      onClick={onClick} 
      style={style}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
