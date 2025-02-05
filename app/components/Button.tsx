"use client";
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, style }) => {
  return (
    <button className={styles["sleek-blue"]} onClick={onClick} style={style}>
      {text}
    </button>
  );
};

export default Button;
