"use client";
import React, { useState } from "react";
import styles from "./AddComment.module.css";

interface AddCommentProps {
    post: string;
}

const AddComment: React.FC<AddCommentProps> = ({ post }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission and page reload

        if (!firstName.trim() || !lastName.trim() || !text.trim()) {
            // Optional: add some user feedback here
            return alert('Name and comment cannot be empty.');
        }

        try {
            const response = await fetch(`/api/posts/${post}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    text
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create comment');
            }

            // Clear the form after a successful submission
            setFirstName('');
            setLastName('');
            setText('');

            location.href = './' + post;
        } catch (err) {
            console.error('Error creating comment:', err);
        }
    };

    return (
        <form className={styles[`add-comment`]} onSubmit={handleSubmit}>
            <div className={styles.name}>
                <input
                    type="text" 
                    placeholder="First Name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} // Update state on change
                />
                <input
                    type="text" 
                    placeholder="Last Name..."
                    value={lastName} // Bind the input value to the state
                    onChange={(e) => setLastName(e.target.value)} // Update state on change
                />
            </div>
            <div className={styles[`comment-and-send-button`]}>
                <textarea
                    className={styles.comment}
                    placeholder="Add Comment..."
                    value={text} // Bind the textarea value to the state
                    onChange={(e) => setText(e.target.value)} // Update state on change
                ></textarea>
                <button type="submit" className={styles.send}>
                    Send
                </button>
            </div>
        </form>
    );
};

export default AddComment;