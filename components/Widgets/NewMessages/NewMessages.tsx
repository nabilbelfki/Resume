import React from "react";
import { isColorTooDark, stringToHexColor } from "@/lib/color";
import styles from "./NewMessages.module.css";

const messages = [
    {
        author: {
            firstName: "Shivam",
            lastName: "Patel"
        },
        message: "Hey Nabil, this is a very cool website, just wanted to send you a message and let you know. It looks like you did very hard work on it. Keep it up dude it’s very impressive. I would love to learn how you did it because I have been wanting to make my own website for some time now. Do you have any suggestions or advice as to how to start because I can seem to do it.",
        date: "2025-08-29",
        time: "16:47:00"
    },
     {
        author: {
            firstName: "Jessica",
            lastName: "Lark"
        },
        message: "Hey Nabil, this is a very cool website, just wanted to send you a message and let you know. It looks like you did very hard work on it. Keep it up dude it’s very impressive. I would love to learn how you did it because I have been wanting to make my own website for some time now. Do you have any suggestions or advice as to how to start because I can seem to do it.",
        date: "2025-08-28",
        time: "13:03:00"
    },
     {
        author: {
            firstName: "Megan",
            lastName: "Bank"
        },
        message: "Hey Nabil, this is a very cool website, just wanted to send you a message and let you know. It looks like you did very hard work on it. Keep it up dude it’s very impressive. I would love to learn how you did it because I have been wanting to make my own website for some time now. Do you have any suggestions or advice as to how to start because I can seem to do it.",
        date: "2025-08-27",
        time: "18:31:00"
    }
];

const NewMessages: React.FC = () => {
    return (<div className={styles.container}>
        <h2 className={styles.title}>New Messages</h2>
        <div className={styles.messages}>
            { messages.map((message, index) => {
                const initials = `${message.author.firstName[0]}${message.author.lastName[0]}`
                const author = `${message.author.firstName} ${message.author.lastName}`;
                const backgroundColor = stringToHexColor(`${message.author.firstName} ${message.author.lastName}`);
                const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';
                return (
                    <div key={`message-${index}`} className={styles.message}>
                        <div className={styles['avatar-and-timestamp']}>
                            <div className={styles.avatar}>
                                <div className={styles.initials} style={{ backgroundColor, color}}>{initials}</div>
                                <div className={styles.name}>{author}</div>
                            </div>
                            <div className={styles.timestamp}>{`${message.date} at ${message.time}`}</div>
                        </div>
                        <div className={styles.text}>{message.message}</div>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default NewMessages;