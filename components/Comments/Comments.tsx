"use client";
import React, { useState } from "react";
import { comment } from '@/lib/types'
import Comment from "@/components/Comment/Comment";
import AddComment from "@/components/AddComment/AddComment";
import styles from "./Comments.module.css";

interface CommentsProp {
    comments: comment[];
}

const Comments: React.FC<CommentsProp> = ({ comments }) => {

    const COMMENT_COUNT = 3;
    const [count, setCount] = useState(COMMENT_COUNT);

    const loadMoreComments = () => {
        setCount(count + COMMENT_COUNT);
    };

    return (
        <div className={styles[`comments-section`]}>
            <div className={styles.comments}>
                {comments.slice(0, count).map((comment, index) => 
                    <Comment 
                        key={'comment' + index} 
                        date={comment.date} 
                        author={comment.author} 
                        time={comment.time}
                        text={comment.text}
                    />
                )}
                <div className={styles.more} onClick={loadMoreComments}>
                    See More
                </div>
            </div>
            < AddComment />
        </div>
    );
};

export default Comments;