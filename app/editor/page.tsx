"use client";
import React from "react";
import dynamic from 'next/dynamic';
import styles from "./Editor.module.css";

// Dynamically import the Editor component without SSR
const Editor = dynamic(() => import('../../components/Editor/Editor'), { ssr: false });

const BlogEditor: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Create a New Blog Post</div>
        <Editor />
      </div>
    </>
  );
};

export default BlogEditor;
