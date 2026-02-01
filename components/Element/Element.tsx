"use client";
import React from "react";
import styles from "./Element.module.css";
import { ListItem, Checkbox} from "@/lib/types";

interface ElementProps {
  tag: string;
  text?: string;
  items?: ListItem[];
  checkboxes?: Checkbox[];
}

const Element: React.FC<ElementProps> = ({ tag, text, items = [], checkboxes = []}) => {
  console.log(text);

  return (
    <>
        {tag === "p" && (
            <p>{text}</p>
        )}
        {tag === "h2" && (
            <h2>{text}</h2>
        )}
        {tag === "ul" && (
            <ul>
              {items.map((item, index) =>
                <li key={`list-item-${index}`} style={{marginLeft: item.marginLeft}}>{item.text}</li>
              )}
            </ul>
        )}
        {tag === "ol" && (
            <ol>
              {items.map((item, index) =>
                <li key={`list-item-${index}`} style={{marginLeft: item.marginLeft}}>{item.text}</li>
              )}
            </ol>
        )}
        {tag === "checkbox" && (
            <div className={styles.checkboxes}>
              {checkboxes.map((checkbox, index) =>
                <div key={`checkbox-${index}`}>
                  <input id={`checkbox-${index}`} checked={checkbox.checked} type="checkbox" />
                  <label htmlFor={`checkbox-${index}`}>{checkbox.text}</label>
                </div>
              )}
            </div>
        )}
    </>
  );
};

export default Element;
