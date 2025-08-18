import React from "react";
import { comment as CommentProp } from '@/lib/types';
import styles from "./Comment.module.css";

const Comment: React.FC<CommentProp> = ({ author, date, time, text }) => {
    const inputDate = new Date(date);
    const now = new Date();

    const stringToHexColor = (str: string): string => {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Convert hash to hex color
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += value.toString(16).padStart(2, '0');
        }

        return color;
    }


    // Strip time to compare only date
    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    // Get "yesterday" by subtracting one day
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    let dateLabel: string;
    if (isSameDay(inputDate, now)) {
        dateLabel = "Today";
    } else if (isSameDay(inputDate, yesterday)) {
        dateLabel = "Yesterday";
    } else {
        // Format as MM/DD/YYYY
        const mm = String(inputDate.getMonth() + 1).padStart(2, '0');
        const dd = String(inputDate.getDate()).padStart(2, '0');
        const yyyy = inputDate.getFullYear();
        dateLabel = `${mm}/${dd}/${yyyy}`;
    }

    const timeStamp = `${dateLabel} at ${time}`;
    const name = `${author.firstName} ${author.lastName}`;
    const firstInitial = author.firstName[0];
    const secondInitial = author.lastName[0];
    const initials = firstInitial + secondInitial;

    return (
        <div className={styles.comment}>
            <div className={styles[`user-and-date-time`]}>
                <div className={styles.user}>
                    <div className={styles.avatar} style={{backgroundColor: stringToHexColor(name)}}>{initials}</div>
                    <div className={styles.name}>{name}</div>
                </div>
                <div className={styles[`date-time`]}>{timeStamp}</div>
            </div>
            <div className={styles.text}>
                {text}
            </div>
        </div>
    );
};

export default Comment;
