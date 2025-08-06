'use client';
import { Key } from './key.type'
import icons from './icons';
import handlers from './handlers';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./Editor.module.css";
import Dropdown from '../Dropdown/Dropdown';

const Editor = () => {
  const [element, setElement] = useState<string | null>('p');
  const buttons = [
    'bold',
    'italic',
    'underline',
    'unorderedList',
    'orderedList',
    'quote',
    'leftAligned',
    'centerAligned',
    'rightAligned',
    'link',
    'warning',
    'code',
    'media',
    'checkbox',
    'table',
    'delimiter',
  ]

  return (
    <div className={styles.container}>
      <div className={styles['top-bar']}>
        <Dropdown 
          placeholder='Choose Element'
          value={element}
          onChange={(value) => {
            setElement(value)
          }}
          options={[
            {label:"Paragraph", value: "p"},
            {label:"Header 2", value: "h2"},
            {label:"Header 3", value: "h3"},
            {label:"Header 4", value: "h4"},
            {label:"Header 5", value: "h5"},
            {label:"Header 6", value: "h6"},
          ]}
          style={
            {
              button: {
                height: 15,
                padding: 15
              }
            }
          }
        />
        {buttons.map(button => (
          <button key={'button-' + button} className={styles.button} onClick={handlers(button as Key)}>
            {icons(button as Key)}
          </button>
        ))}
      </div>
      <div className={styles.editor}>
        <p contentEditable="true"></p>
      </div>
      <div className={styles['bottom-bar']}>
        <span className={styles['word-count']}>Word Count: 1337</span>
      </div>
    </div>
  );
};

export default Editor;