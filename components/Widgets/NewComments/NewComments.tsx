import React from "react";
import { isColorTooDark, stringToHexColor } from "@/lib/color";
import styles from "./NewComments.module.css";

const comments = [
    {
        author: {
            firstName: "Cindy",
            lastName: "Ma"
        },
        blog:"Unix Time Ending Soon",
        comment: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
        date: "2025-08-29",
        time: "16:47:00"
    },
    {
        author: {
            firstName: "Michael",
            lastName: "Resello"
        },
        blog:"5 Ways to Improve your Coding",
        comment: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
        date: "2025-08-28",
        time: "13:03:00"
    },
    {
        author: {
            firstName: "Megan",
            lastName: "Bank"
        },
        blog:"",
        comment: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
        date: "2025-08-27",
        time: "18:31:00"
    },
    {
        author: {
            firstName: "Lin",
            lastName: "Ching"
        },
        blog:"",
        comment: "Hey Nabil love the blog post dude. I totally agree Visual Studio Code is definitely the most versatile IDE and the best one in my opinion too! I really liked your comparison section, it went into great detail and was an thorough breakdown. I will say though that I think that xCode is the most compatible browser because it won the award for the past three years in a row and supports Swift, Kotlin and all mobile languages, so I will have to disagree with you on that part.",
        date: "2025-08-27",
        time: "18:31:00"
    }
];

const NewComments: React.FC = () => {
    return (<div className={styles.container}>
        <h2 className={styles.title}>New Comments</h2>
        <div className={styles.comments}>
            {comments.map((comment, index) => {
                const initials = `${comment.author.firstName[0]}${comment.author.lastName[0]}`
                const author = `${comment.author.firstName} ${comment.author.lastName}`;
                const backgroundColor = stringToHexColor(`${comment.author.firstName} ${comment.author.lastName}`);
                const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';
                return (
                    <div key={`comment-${index}`} className={styles.comment}>
                        <div className={styles['avatar-blog-and-timestamp']}>
                            <div className={styles.avatar}>
                                <div className={styles.initials} style={{ backgroundColor, color}}>{initials}</div>
                                <div className={styles.name}>{author}</div>
                            </div>
                            <div className={styles['blog-and-timestamp']}>
                                <div className={styles.timestamp}>{`${comment.date} at ${comment.time}`}</div>
                                <div className={styles.blog}>{comment.blog}</div>
                            </div>
                        </div>
                        <div className={styles.text}>{comment.comment}</div>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default NewComments;