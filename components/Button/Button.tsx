"use client";
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, style, className, disabled = false }) => {
  
  return (
    <button 
      className={`${styles["sleek-blue"]} ${className ? className : ""}`} 
      onClick={onClick} 
      style={style}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
