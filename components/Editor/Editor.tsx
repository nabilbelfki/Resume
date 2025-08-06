'use client';
import { Key } from './key.type'
import icons from './icons';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./Editor.module.css";
import Dropdown from '../Dropdown/Dropdown';
import Paragraph from './Elements/Paragraph/Paragraph';
import Heading from './Elements/Heading/Heading';
import OrderedList from './Elements/OrderedList/OrderedList';
import UnorderedList from './Elements/UnorderedList/UnorderedList';

type Block = {
    id: number;
    type: string;
    content: string;
    textAlign?: 'left' | 'center' | 'right';
};

const Editor = () => {
    const [blocks, setBlocks] = useState<Block[]>([
        { id: Date.now(), type: 'p', content: '', textAlign: 'left' }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<number>(blocks[0].id);
    const blockRefs = useRef<{ [key: number]: HTMLElement }>({});

    // Determine if the dropdown should be enabled
    const activeBlock = blocks.find(block => block.id === activeBlockId);
    const isParagraphOrHeading = activeBlock && ['p', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(activeBlock.type);

    useEffect(() => {
        if (activeBlockId !== null) {
            const elementToFocus = blockRefs.current[activeBlockId];
            if (elementToFocus) {
                elementToFocus.focus();
                
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(elementToFocus);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }, [activeBlockId]);

    const deleteBlock = (id: number) => {
        const blockIndex = blocks.findIndex(block => block.id === id);
        if (blockIndex === -1) return;

        const newBlocks = blocks.filter(block => block.id !== id);
        setBlocks(newBlocks);

        if (blockIndex > 0) {
            const prevBlock = blocks[blockIndex - 1];
            setActiveBlockId(prevBlock.id);
        }
    };

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
    ];

    const handleAlignment = (alignment: 'left' | 'center' | 'right') => {
        setBlocks(blocks.map(block =>
            block.id === activeBlockId ? { ...block, textAlign: alignment } : block
        ));
    };

    const handleElementChange = (newType: string) => {
        setBlocks(blocks.map(block =>
            block.id === activeBlockId ? { ...block, type: newType } : block
        ));
    };

    const updateBlockContent = (id: number, content: string) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, content } : block
        ));
    };

    const addBlockAfter = (index: number, newBlockType: string = 'p') => {
        const newBlockId = Date.now();
        const newBlock: Block = { id: newBlockId, type: newBlockType, content: '', textAlign: 'left' };
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index + 1, 0, newBlock);
        setBlocks(updatedBlocks);
        setActiveBlockId(newBlockId);
    };

    const handleFocus = (blockId: number) => {
        setActiveBlockId(blockId);
    };

    const renderComponent = (block: Block, index: number) => {
      const commonProps = {
        key: block.id,
        editable: true,
        content: block.content,
        onFocus: () => handleFocus(block.id),
        onEnter: () => addBlockAfter(index),
        onContentUpdate: (content: string) => updateBlockContent(block.id, content),
        onDelete: () => deleteBlock(block.id),
        textAlign: block.textAlign,
        ref: (el: HTMLElement | null) => {
            if (el) blockRefs.current[block.id] = el;
            else delete blockRefs.current[block.id];
        },
    };

      const handleEmptyEnter = () => {
        addBlockAfter(index, 'p');
      };

      const handleEmptyBackspace = () => {
        deleteBlock(block.id);
      };

      switch (block.type) {
        case 'p':
          return <Paragraph {...commonProps} />;
        case 'h2':
          return <Heading {...commonProps} />;
        case 'h3':
          return <Heading heading={3} {...commonProps} />;
        case 'h4':
          return <Heading heading={4} {...commonProps} />;
        case 'h5':
          return <Heading heading={5} {...commonProps} />;
        case 'h6':
          return <Heading heading={6} {...commonProps} />;
        case 'ul':
          return <UnorderedList {...commonProps} onEmptyEnter={handleEmptyEnter} onEmptyBackspace={handleEmptyBackspace} />;
        case 'ol':
          return <OrderedList {...commonProps} onEmptyEnter={handleEmptyEnter} onEmptyBackspace={handleEmptyBackspace} />;
        default:
          return null;
      }
    };
    
    const addBlock = (type: string) => {
        const newBlock: Block = { id: Date.now(), type, content: '', textAlign: 'left' };
        setBlocks([...blocks, newBlock]);
    };

    const createHandler = (key: Key) => {
        return {
            bold: () => document.execCommand('bold', false, undefined),
            italic: () => document.execCommand('italic', false, undefined),
            underline: () => document.execCommand('underline', false, undefined),
            unorderedList: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'ul');
                } else {
                    addBlock('ul');
                }
            },
            orderedList: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'ol');
                } else {
                    addBlock('ol');
                }
            },
            quote: () => {},
            leftAligned: () => handleAlignment('left'),
            centerAligned: () => handleAlignment('center'),
            rightAligned: () => handleAlignment('right'),
            link: () => {},
            warning: () => {},
            code: () => {},
            media: () => {},
            checkbox: () => {},
            table: () => {},
            delimiter: () => {},
        }[key];
    };

    return (
        <div className={styles.container}>
            <div className={styles['top-bar']}>
                <Dropdown
                    placeholder='Choose Element'
                    value={activeBlock ? activeBlock.type : 'p'}
                    onChange={(value) => handleElementChange(value)}
                    disabled={!isParagraphOrHeading}
                    options={[
                        { label: "Paragraph", value: "p" },
                        { label: "Header 2", value: "h2" },
                        { label: "Header 3", value: "h3" },
                        { label: "Header 4", value: "h4" },
                        { label: "Header 5", value: "h5" },
                        { label: "Header 6", value: "h6" },
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
                    <button key={'button-' + button} className={styles.button} onClick={createHandler(button as Key)}>
                        {icons(button as Key)}
                    </button>
                ))}
            </div>
            <div className={styles.editor}>
                {blocks.map((block, index) => renderComponent(block, index))}
            </div>
            <div className={styles['bottom-bar']}>
                <span className={styles['word-count']}>Word Count: 1337</span>
            </div>
        </div>
    );
};

export default Editor;