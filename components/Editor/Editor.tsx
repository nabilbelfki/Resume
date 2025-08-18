'use client';
import { Key } from './key.type'
import icons from './icons';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from "./Editor.module.css";
import Dropdown from '../Dropdown/Dropdown';
import Paragraph from './Elements/Paragraph/Paragraph';
import Heading from './Elements/Heading/Heading';
import OrderedList from './Elements/OrderedList/OrderedList';
import UnorderedList from './Elements/UnorderedList/UnorderedList';
import Anchor from './Elements/Anchor/Anchor';
import Table from './Elements/Table/Table';
import Warning from './Elements/Warning/Warning';
import Quote from './Elements/Quote/Quote';
import Delimiter from "./Elements/Delimiter/Delimiter"
import Checkbox from "./Elements/Checkbox/Checkbox"
import Media from "./Elements/Media/Media"
import Code from './Elements/Code/Code';
import { Block, Element, EditorHandle } from "@/lib/types"

type Line = {
    id: number;
    content: string;
    level?: number;
    checked?: boolean;
}

interface EditorProps {
    
}

const Editor = forwardRef<EditorHandle, EditorProps>((props, ref) => {
    const [editable, setEditable] = useState(true);
    const [blocks, setBlocks] = useState<Block[]>([
        { id: Date.now(), type: 'p', content: '', textAlign: 'left' }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<number>(blocks[0].id);
    const blockRefs = useRef<{ [key: number]: HTMLElement }>({});
    const [wordCount, setWordCount] = useState(0);

    // Determine if the dropdown should be enabled
    const activeBlock = blocks.find(block => block.id === activeBlockId);
    const isParagraphOrHeading = activeBlock && ['p', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(activeBlock.type);

    const [focusPosition, setFocusPosition] = useState<'start' | 'end'>('start');

    const handleArrowNavigation = (direction: 'up' | 'down', blockId: number) => {
        const currentIndex = blocks.findIndex(block => block.id === blockId);
        
        if (direction === 'up' && currentIndex > 0) {
            setFocusPosition('end'); // When going up, focus at end of previous block
            setActiveBlockId(blocks[currentIndex - 1].id);
        } else if (direction === 'down' && currentIndex < blocks.length - 1) {
            setFocusPosition('start'); // When going down, focus at start of next block
            setActiveBlockId(blocks[currentIndex + 1].id);
        }
    };

    useEffect(() => {
        const newWordCount = calculateTotalWordCount(blocks);
        setWordCount(newWordCount);
    }, [blocks]);

    useImperativeHandle(ref, () => ({
        getContent: () => getContent(),
        setBlocks: (newBlocks: Block[]) => {
            setBlocks(newBlocks);
            if (newBlocks.length > 0) {
            setActiveBlockId(newBlocks[0].id);
            }
        }
    }), [blocks]);

    const countWords = (html: string, type = ''): number => {
        if ((type === 'ol' || type === 'ul' || type === 'checkbox') && html.includes('id')) {
            const lines: Line[] = JSON.parse(html);
            html = "";
            lines.forEach((line) => {
                if (html !== "") html += " ";
                html += line.content;
            });          
        }
        // Create a temporary div element to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Get text content and clean it up
        const text = temp.textContent || '';
        
        // Split into words and filter out empty strings
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        
        return words.length;
    };

    const calculateTotalWordCount = (blocks: Block[]): number => {
        return blocks.reduce((total, block) => {
            const excludedTypes = [
                // 'ul', 
                'delimiter', 
                'media', 
                'code'
            ];

            if (excludedTypes.includes(block.type)) {
                return total;
            }
            
            // Default case - count words in the content
            return total + countWords(block.content, block.type);
        }, 0);
    };

    // Updated focus effect
    useEffect(() => {
        if (activeBlockId !== null) {
            const elementToFocus = blockRefs.current[activeBlockId];
            if (elementToFocus) {
                elementToFocus.focus();
                
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    
                    if (focusPosition === 'start') {
                        // Focus at start
                        range.selectNodeContents(elementToFocus);
                        range.collapse(true);
                    } else {
                        // Focus at end
                        range.selectNodeContents(elementToFocus);
                        range.collapse(false);
                    }
                    
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }, [activeBlockId, focusPosition]);

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

    const getContent = () => {
        const content: Element[] = [];
        blocks.forEach(block => {
            const type = block.type;
            if (type === 'p' || ['h2', 'h3', 'h4', 'h5', 'h6'].includes(type)) {
                content.push({
                    tag: type,
                    text: block.content,
                    textAlign: block.textAlign
                });
            } else if (['ol', 'ul'].includes(type)) {
                interface Item {
                    marginLeft: number;
                    text: string;
                }
                const items: Item[] = [];
                JSON.parse(block.content).forEach((item: Line) => {
                    items.push({
                        marginLeft: (item.level ?? 0) * 20,
                        text: item.content
                    });
                });
                content.push({
                    tag: type,
                    items
                })
            } else if (type === 'media') {
                const media = JSON.parse(block.content);
                const extension = media.name.split('.').pop().toLowerCase();
                if (media.path.substring(0, 7) === "/images") {
                    content.push({
                        tag: 'img',
                        source: `${media.path}${media.name}`
                    });
                } else if (media.path.substring(0, 7) === "/videos") {
                    content.push({
                        tag: 'video',
                        source: `${media.path}${media.name}`
                    });
                } else if (media.path.substring(0, 7) === "/sounds") {
                    content.push({
                        tag: 'audio',
                        source: `${media.path}${media.name}`,
                        extension: `${extension}`
                    });
                }
            } else if (type === 'quote' || type === 'warning') {
                content.push({
                    tag: type,
                    text: block.content,
                    textAlign: block.textAlign
                });
            } else if (type === 'table') {
                const records = JSON.parse(block.content);
                content.push({
                    tag: type,
                    records
                });
            } else if (type === 'checkbox') {
                interface Item {
                    checked: boolean;
                    text: string;
                }
                const items: Item[] = [];
                JSON.parse(block.content).forEach((item: Line) => {
                    const checked = item.checked ?? false;
                    items.push({
                        checked,
                        text: item.content
                    });
                });
                content.push({
                    tag: type,
                    items
                })
            } else if (type === 'delimiter') {
                const delimiter = JSON.parse(block.content);
                content.push({
                    tag: type,
                    color: delimiter.color,
                    type: delimiter.type,
                    thickness: delimiter.thickness,
                    dashLength: delimiter.type === 'solid' ? 0 : delimiter.dashLength
                })
            }
        });

        return content;
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

    const handleEditorClick = () => {
        console.log("Editor Clicked");
        // const nonEscapableBlocks = ['table', 'delimiter', 'media', 'code'];
        // let lastBlock = blocks[blocks.length - 1];
        // if (nonEscapableBlocks.includes(lastBlock.type)) {
        //     addBlock('p');
        //     lastBlock = blocks[blocks.length - 1];
        // }
        console.log(blocks)
        // setActiveBlockId(lastBlock.id);
    }

    const updateBlockContent = (id: number, content: string) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, content } : block
        ));
    };

    const addBlockAfter = (index: number, newBlockType: string = 'p', initialContent: string = '') => {
        const newBlockId = Date.now();
        const newBlock: Block = { id: newBlockId, type: newBlockType, content: initialContent, textAlign: newBlockType === 'quote' ? 'center' : 'left' };
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
            editable,
            content: block.content,
            onFocus: () => handleFocus(block.id),
            onArrowUp: () => handleArrowNavigation('up', block.id),
            onArrowDown: () => handleArrowNavigation('down', block.id),
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
                return <Paragraph key={block.id} {...commonProps} />;
            case 'h2':
                return <Heading key={block.id} {...commonProps} />;
            case 'h3':
                return <Heading key={block.id} heading={3} {...commonProps} />;
            case 'h4':
                return <Heading key={block.id} heading={4} {...commonProps} />;
            case 'h5':
                return <Heading key={block.id} heading={5} {...commonProps} />;
            case 'h6':
                return <Heading key={block.id} heading={6} {...commonProps} />;
            case 'ul':
                return <UnorderedList key={block.id} {...commonProps} onEmptyEnter={handleEmptyEnter} onEmptyBackspace={handleEmptyBackspace} />;
            case 'ol':
                return <OrderedList key={block.id} {...commonProps} onEmptyEnter={handleEmptyEnter} onEmptyBackspace={handleEmptyBackspace} />;
            case 'a':
                return <Anchor key={block.id} {...commonProps} />;
            case 'table':
                return <Table key={block.id} {...commonProps} />;
            case 'quote':
                return <Quote key={block.id} {...commonProps} />;
            case 'warning':
                return <Warning key={block.id} {...commonProps} />;
            case 'delimiter':
                return <Delimiter key={block.id} {...commonProps} />;
            case 'code':
                return <Code key={block.id} {...commonProps} />;
            case 'checkbox':
                return <Checkbox key={block.id} {...commonProps}  onEmptyEnter={handleEmptyEnter} onEmptyBackspace={handleEmptyBackspace} />;
            case 'media':
                let mediaValue;
                try {
                    mediaValue = block.content ? JSON.parse(block.content) : { name: '', path: '' };
                } catch {
                    mediaValue = { name: '', path: '' };
                }
                return <Media 
                    key={block.id} 
                    value={mediaValue}
                    onChange={(value) => updateBlockContent(block.id, JSON.stringify(value))}
                    // onFocus={() => handleFocus(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    ref={(el: HTMLElement | null) => {
                        if (el) blockRefs.current[block.id] = el;
                        else delete blockRefs.current[block.id];
                    }}
                />;
            default:
                return null;
        }
    };
    
    const addBlock = (type: string, content: string = '') => {
        const newBlock: Block = { id: Date.now(), type, content, textAlign: type === 'quote' ? 'center' : 'left' };
        setBlocks([...blocks, newBlock]);
        setActiveBlockId(newBlock.id);
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
            quote: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'quote');
                } else {
                    addBlock('quote');
                }
            },
            leftAligned: () => handleAlignment('left'),
            centerAligned: () => handleAlignment('center'),
            rightAligned: () => handleAlignment('right'),
            link: () => {
                const url = window.prompt('Enter the URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
            },
            warning: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'warning');
                } else {
                    addBlock('warning');
                }
            },
            code: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'code');
                } else {
                    addBlock('code');
                }
            },
            media: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                const initialContent = JSON.stringify({ name: '', path: '', backgroundColor: '' });
                if (index !== -1) {
                    addBlockAfter(index, 'media', initialContent);
                } else {
                    addBlock('media', initialContent);
                }
            },
            checkbox: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'checkbox');
                } else {
                    addBlock('checkbox');
                }
            },
            table: () => { // Updated table handler to add a default 2x2 table
                const initialTableData = JSON.stringify([['', ''], ['', '']]);
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'table', initialTableData);
                } else {
                    addBlock('table', initialTableData);
                }
            },
            delimiter: () => {
                const index = blocks.findIndex(block => block.id === activeBlockId);
                if (index !== -1) {
                    addBlockAfter(index, 'delimiter');
                } else {
                    addBlock('delimiter');
                }
            },
        }[key];
    };

    return (
         <div 
            className={styles.container}
        >
            <div className={styles['top-bar']}>
                <Dropdown
                    placeholder='Choose Element'
                    value={activeBlock ? activeBlock.type : 'p'}
                    onChange={(value) => handleElementChange(value || 'p')}
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
                    <button key={'button-' + button} className={styles.button} onMouseDown={(e) => { e.preventDefault(); createHandler(button as Key)(); }}>
                        {icons(button as Key)}
                    </button>
                ))}
                <div className={styles['visual-or-text']}>
                    <button className={!editable ? styles.selected : ''} onClick={() => setEditable(false)}>Visual</button>
                    <button className={editable ? styles.selected : ''} onClick={() => setEditable(true)}>Text</button>
                </div>
            </div>
            <div 
                className={styles.editor}
                onClick={() => handleEditorClick()}
            >
                {blocks.map((block, index) => renderComponent(block, index))}
            </div>
            <div className={styles['bottom-bar']}>
                <span className={styles['word-count']}>Word Count: {wordCount.toLocaleString()}</span>
            </div>
        </div>
    );
});

export default Editor;