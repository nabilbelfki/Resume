import React from "react";
import { comment as CommentProp } from '@/lib/types';
import styles from "./Comment.module.css";
import { formatTime, formatDateHumanReadable } from "@/lib/utilities";
import { stringToHexColor, isColorTooDark } from "@/lib/color"

const Comment: React.FC<CommentProp> = ({ author, date, time, text }) => {

    const timeStamp = `${formatDateHumanReadable(new Date(date))} at ${time}`;
    const name = `${author.firstName} ${author.lastName}`;
    const firstInitial = author.firstName[0];
    const secondInitial = author.lastName[0];
    const initials = firstInitial + secondInitial;
    const backgroundColor = stringToHexColor(name);
    const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';
    return (
        <div className={styles.comment}>
            <div className={styles[`user-and-date-time`]}>
                <div className={styles.user}>
                    <div className={styles.avatar} style={{ backgroundColor, color }}>{initials}</div>
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
