"use client";
import React, { useState } from "react";
import { comment } from '@/lib/types'
import Comment from "@/components/Comment/Comment";
import AddComment from "@/components/AddComment/AddComment";
import styles from "./Comments.module.css";

interface CommentsProp {
    post: string;
    comments: comment[];
}

const Comments: React.FC<CommentsProp> = ({ post, comments }) => {

    const COMMENT_COUNT = 3;
    const [count, setCount] = useState(COMMENT_COUNT);
    console.log("Comments", comments)
    const loadMoreComments = () => {
        setCount(count + COMMENT_COUNT);
    };

    return (
        <div className={styles[`comments-section`]}>
            <div className={styles.comments} style={{marginBottom: comments.length > 0 ? 70 : 40}}>
                {comments.length === 0 ? (
                    <div className={styles['no-comments']}>No comments yet. Be the first to comment!</div>
                ) : (
                    <>
                        {comments.slice(0, count).map((comment, index) => 
                            <Comment 
                                key={'comment' + index} 
                                date={comment.date} 
                                author={comment.author ?? {firstName: '', lastName: ''}} 
                                time={comment.time}
                                text={comment.text}
                            />
                        )}
                        {comments.length > count && (
                            <div className={styles.more} onClick={loadMoreComments}>
                                See More
                            </div>
                        )}
                    </>
                )}
            </div>
            < AddComment post={post}/>
        </div>
    );
};

export default Comments;