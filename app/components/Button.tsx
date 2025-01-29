import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    text: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button className={styles['sleek-blue']} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
