import React from "react";
import styles from "./Toggle.module.css";

interface ToggleProps {
    identifier: string;
    value: boolean;
    toggle: (key: string, newState: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ identifier, value, toggle }) => {
    
    const handleToggle = () => {
        console.log("Toggling ", identifier);
        toggle(identifier, !value);

    };
    
    return (
        <div onClick={handleToggle} className={`${styles.container} ${ value ? styles.selected : ''}`}>
            <div className={styles.toggle}></div>
        </div>
    );
};

export default Toggle;