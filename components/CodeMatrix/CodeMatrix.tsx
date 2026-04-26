"use client";
import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./CodeMatrix.module.css";

import { snippets } from "./snippets";

const TypewriterBlock = ({ delay, isVisible }: { delay: number, isVisible: boolean }) => {
  const [text, setText] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(
    Math.floor(Math.random() * snippets.length)
  );
  const [blockStyle, setBlockStyle] = useState<React.CSSProperties>({
    opacity: 0,
    position: "absolute",
  });

  useEffect(() => {
    if (!isVisible) return;
    
    // Lock column dimensions but permit slightly overlapping layout tracking
    setBlockStyle({
      position: "relative",
      marginTop: `${Math.random() * 40 - 20}px`,
      fontSize: `${Math.floor(Math.random() * 6) + 11}px`, // 11px to 17px
      opacity: Math.random() * 0.4 + 0.3, // 0.3 to 0.7 opacity
      transform: `translateY(${Math.random() * -10}%)`,
    });
    let currentLength = 0;
    const targetSnippet = snippets[snippetIndex];
    let typeInterval: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      typeInterval = setInterval(() => {
        currentLength += Math.floor(Math.random() * 40) + 15; // Type massive blocks (15-55 string chars) natively due to heavy components

        if (currentLength >= targetSnippet.length) {
          currentLength = targetSnippet.length;
          setText(targetSnippet.substring(0, currentLength));
          clearInterval(typeInterval);

          // Hold the full block for a few seconds then randomly swap
          setTimeout(() => {
            setText("");
            setSnippetIndex(Math.floor(Math.random() * snippets.length));
          }, 3000 + Math.random() * 4000);
        } else {
          setText(targetSnippet.substring(0, currentLength));
        }
      }, 20); // Extremely fast rendering frame lock
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typeInterval);
    };
  }, [snippetIndex, delay, isVisible]);

  return (
    <div style={blockStyle} className={styles.codeChunkContainer}>
      <SyntaxHighlighter
        language="typescript"
        style={vscDarkPlus}
        customStyle={{ background: "transparent", margin: 0, padding: 0, fontSize: "inherit", overflow: "visible" }}
        className={styles.codeChunk}
      >
        {text || " "}
      </SyntaxHighlighter>
    </div>
  );
};

const CodeMatrix: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const blocks = Array.from({ length: 6 }).map((_, i) => (
    <TypewriterBlock key={i} delay={Math.random() * 2000} isVisible={isVisible} />
  ));

  return (
    <div ref={containerRef} className={styles.codeBackground}>
      {blocks}
    </div>
  );
};

export default CodeMatrix;
