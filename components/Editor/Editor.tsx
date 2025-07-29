'use client';
import React, { useEffect, useRef, useState } from 'react';
import { EDITOR_JS_TOOLS } from './EditorConstants';
import EditorJS from '@editorjs/editorjs';
import styles from "./Editor.module.css";

// Basic JSON-to-HTML converter (simplified version)
const convertToHtml = (blocks: any[]) => {
  return blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'image':
        return `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width: 100%;"/>`;
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map((item: string) => `<li>${item}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      case 'quote':
        return `<blockquote>${block.data.text}<br/>- ${block.data.caption}</blockquote>`;
      case 'code':
        return `<pre><code>${block.data.code}</code></pre>`;
      case 'embed':
        return `<div class="embed">${block.data.embed}</div>`;
      default:
        return `<div>Unsupported block type: ${block.type}</div>`;
    }
  }).join('');
};

const Editor = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const isInitialized = useRef(false);
  const [htmlOutput, setHtmlOutput] = useState<string>('');

  const handleSave = async () => {
    try {
      const savedData = await editorRef.current?.save();
      if (savedData?.blocks) {
        const html = convertToHtml(savedData.blocks);
        setHtmlOutput(html);
        console.log('Generated HTML:', html);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;

    const initEditor = async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default;
      
      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: 'editorjs',
          // tools: EDITOR_JS_TOOLS,
          autofocus: true,
          placeholder: 'Start writing your blog post...',
          inlineToolbar: true,
          onReady: () => {
            console.log('Editor.js is ready!');
          },
        });
        isInitialized.current = true;
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        id="editorjs"
        className={styles.editor}
      ></div>

      <button
        onClick={handleSave}
        className={styles.saveButton}
      >
        Save Post
      </button>

      {htmlOutput && (
        <div className={styles.outputContainer}>
          <h3>Blog Post Preview:</h3>
          <div
            className={styles.htmlOutput}
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;