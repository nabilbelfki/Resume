import React from "react";
import styles from "./Heading.module.css"

interface AnchorProps {
    editable: boolean;
}

const Anchor: React.FC<AnchorProps> = ({ editable }) => {
    return (<a className={styles.anchor} contentEditable={editable}>
        
    </a>);
}

export default Anchor