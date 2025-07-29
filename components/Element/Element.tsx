"use client";
import React from "react";
import styles from "./Element.module.css";

interface ElementProps {
  tag: string;
  text?: string;
}

const Element: React.FC<ElementProps> = ({ tag, text }) => {

  return (
    <>
        {tag === "p" && (
            <p>{text}</p>
        )}
        {tag === "h2" && (
            <h2>{text}</h2>
        )}
    </>
  );
};

export default Element;
