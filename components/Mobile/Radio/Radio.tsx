import React from "react";
import styles from "./Radio.module.css";
import { Radio as RadioType} from "@/lib/types";

interface RadioProps {
    name: string;
    value: string;
    radios: RadioType[];
    select: (newState: string) => void;
}

const Radio: React.FC<RadioProps> = ({ name, value, select, radios }) => {

    const handleClick = (value: string) => {
        select(value);
    };

    return (<div className={styles.radios}>
        {radios.map((radio, index) =>
            (<div 
                key={`radio-${name}-${index}`} 
                onClick={() => handleClick(radio.value)}
                className={styles.radio}
            >
                <input type="radio" id={radio.ID} name={name} value={radio.value} checked={value == radio.value}/>
                <label htmlFor={radio.ID}>{radio.label}</label>
            </div>)
        )}
    </div>);
}

export default Radio;