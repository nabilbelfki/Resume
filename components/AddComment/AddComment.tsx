import React from "react";
import styles from "./AddComment.module.css";

const AddComment: React.FC = () => {
    return (
        <div className={styles[`add-comment`]}>
            <input className={styles.name} type="text" placeholder="Name..." />
            <div className={styles[`comment-and-send-button`]}>
                <textarea className={styles.comment} placeholder="Add Comment..."></textarea>
                <button className={styles.send}>
                    Send
                </button>
            </div>
        </div>
    );   
};

export default AddComment;