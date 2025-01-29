import React from 'react';
import styles from './Popup.module.css';

interface PopupProps {
    title: string;
    body: React.ReactNode;
    actions: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, body, actions }) => {
    return (
        <div className={styles.popup}>
            <div className={styles['popup-title']}>{title}</div>
            <div className={styles['popup-body']}>
                {body}
            </div>
            <div className={styles['popup-actions']}>
                {actions}
            </div>
        </div>
    );
};

export default Popup;