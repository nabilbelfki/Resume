"use client";
import React from "react";
import styles from "./Popup.module.css";
import Loading from "@/components/Loading/Loading"

interface PopupProps {
  title: string;
  body: React.ReactNode;
  style?: React.CSSProperties;
  actions: React.ReactNode;
  showing: boolean;
  isLoading: boolean;
  onClose: () => void;
}
const Popup: React.FC<PopupProps> = ({
  title,
  body,
  style,
  actions,
  showing,
  isLoading,
  onClose,
}) => {
  if (!showing) return null; // Don't render the popup if not showing

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Loading isLoading={isLoading} zIndex={10000}/>
      <div style={style} className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles["popup-title"]}>{title}</div>
        <div className={styles["popup-body"]}>{body}</div>
        <div className={styles["popup-actions"]}>{actions}</div>
      </div>
    </div>
  );
};

export default Popup;
