import React, { useRef, useEffect, useState } from "react";
import styles from "./Table.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import ColorPicker from "@/components/ColorPicker/ColorPicker";

interface Properties {
    rows: number;
    columns: number;
    text: {
        family: string;
        size: number;
        weight: number;
        color: string;
        textAlign: 'left' | 'center' | 'right';
    },
    cell: {
        color: string;
        padding: number;
    },
    border: {
        type: 'solid' | 'dashed';
        color: string;
        sides: {
            top: boolean;
            left: boolean;
            right: boolean;
            bottom: boolean;
        }
        thickness: number;
        dash?: number;
        radius?: number;
    }
}

interface TableProps {
    editable: boolean;
    content: string;
    onFocus: () => void;
    onContentUpdate: (content: string) => void;
    onDelete: () => void;
    onEnter: () => void;
}

// Helper to convert data to JSON string for storage
const serializeTableData = (data: string[][]) => JSON.stringify(data);
// Helper to parse JSON string back to data
const deserializeTableData = (json: string): string[][] => {
    try {
        const data = JSON.parse(json);
        return Array.isArray(data) && data.every(row => Array.isArray(row)) ? data : [['']];
    } catch (e) {
        return [['']]; // Return a default 1x1 table on error
    }
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(({
    editable,
    content,
    onFocus,
    onContentUpdate,
    onDelete,
    onEnter
}, ref) => {
    const internalRef = useRef<HTMLTableElement>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const [properties, setProperties] = useState<Properties>({
        rows: 2,
        columns: 2,
        text: {
            family: 'Inter',
            size: 16,
            weight: 300,
            color: '#4C4C4C',
            textAlign: 'left',
        },
        cell: {
            color: '#ECECEC',
            padding: 5,
        },
        border: {
            type: 'solid',
            color: '#FFFFFF',
            sides: {
                top: true,
                left: true,
                right: true,
                bottom: true,
            },
            thickness: 2,
        }
    })
    const [tableData, setTableData] = useState<string[][]>(deserializeTableData(content));

    // Update internal state when content prop changes
    useEffect(() => {
        setTableData(deserializeTableData(content));
    }, [content]);

    // Handle input in table cells
    const handleCellInput = (e: React.FormEvent<HTMLTableCellElement>, rowIndex: number, colIndex: number) => {
        const newTableData = [...tableData];
        newTableData[rowIndex][colIndex] = e.currentTarget.innerHTML;
        setTableData(newTableData);
        onContentUpdate(serializeTableData(newTableData));
    };

    // Add a new row to the table
    const addRow = () => {
        const newRow = Array(tableData[0]?.length || 1).fill('');
        const newTableData = [...tableData, newRow];
        setTableData(newTableData);
        onContentUpdate(serializeTableData(newTableData));
    };

    // Add a new column to the table
    const addColumn = () => {
        const newTableData = tableData.map(row => [...row, '']);
        setTableData(newTableData);
        onContentUpdate(serializeTableData(newTableData));
    };

    // Handle keyboard events for the entire table
    const handleTableKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
        if (e.key === 'Backspace' && tableData.length <= 1 && tableData[0].length <= 1 && tableData[0][0] === '') {
            e.preventDefault();
            onDelete();
        }
    };

    const handleTableClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolbarVisible(true);
    };

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rows = parseFloat(e.target.value);
        setProperties(prev => ({
            ...prev,
            rows: rows,
        }));
    };

    const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const columns = parseFloat(e.target.value);
        setProperties(prev => ({
            ...prev,
            columns: columns,
        }));
    };

    const toggleSide = (side: 'top' | 'right' | 'left' | 'bottom') => {
        const value = properties.border.sides[side];
        setProperties(prev => ({
            ...prev,
            border: {
                ...prev.border,
                sides: {
                    ...prev.border.sides,
                    [side]: !value
                }
            },
        }));
    };
    
    // Combine both internal and external refs
    const refToUse = (el: HTMLTableElement | null) => {
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLTableElement | null>).current = el;
        }
        (internalRef as React.MutableRefObject<HTMLTableElement | null>).current = el;
    };

    return (
        <div className={styles.container} onFocus={onFocus}>
            <table
                ref={refToUse}
                className={styles.table}
                onKeyDown={handleTableKeyDown}
                onClick={handleTableClick}
            >
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={styles.tableCell}
                                    contentEditable={editable}
                                    suppressContentEditableWarning={true}
                                    onInput={(e) => handleCellInput(e, rowIndex, colIndex)}
                                    dangerouslySetInnerHTML={{ __html: cell }}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isToolbarVisible && (
                <div className={styles.toolbar} onClick={e => e.stopPropagation()}>
                <div className={styles.rows}>
                    <label htmlFor="rows">Rows</label>
                    <input 
                    value={properties.rows}
                    onChange={handleRowChange}
                    type="number"
                    id="rows"
                    />
                </div>
                <div className={styles.columns}>
                    <label htmlFor="columns">Columns</label>
                    <input 
                    value={properties.columns}
                    onChange={handleColumnChange}
                    type="number" 
                    id="columns"
                    />
                </div>
                <div className={styles['text-properties']}>
                    <label htmlFor="">
                        Text Properties
                    </label>
                    <div className={styles.properties}>
                        <ColorPicker 
                            ID={'text-color'} 
                            // value={} 
                            // onChange={(value) => handleColorChange(value)} 
                        />
                        <Dropdown 
                            placeholder='Choose Font'
                            value={properties.text.family}
                            options={[
                            { label: 'Inter',value: 'Inter' },
                            { label: 'Open Sans', value: 'san-serif' }
                            ]}
                            style={{
                                button: {
                                    height: 30,
                                    padding: 15
                                }
                            }
                            }
                        />
                        <div className={styles.alignment}>
                            <button className={properties.text.textAlign === 'left' ? styles.selected : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 5" fill="none">
                                    <rect width="4" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                    <rect y="2.3999" width="4" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                    <rect y="1.19995" width="3" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                    <rect y="3.6001" width="3" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                </svg>
                            </button>
                            <button className={properties.text.textAlign === 'center' ? styles.selected : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 5" fill="none">
                                    <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 0)" fill="#4C4C4C"/>
                                    <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 2.3999)" fill="#4C4C4C"/>
                                    <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 3.5 1.19995)" fill="#4C4C4C"/>
                                    <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 3.5 3.6001)" fill="#4C4C4C"/>
                                </svg>
                            </button>
                            <button className={properties.text.textAlign === 'right' ? styles.selected : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 5" fill="none">
                                    <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 0)" fill="#4C4C4C"/>
                                    <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 2.3999)" fill="#4C4C4C"/>
                                    <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 1.19995)" fill="#4C4C4C"/>
                                    <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 3.6001)" fill="#4C4C4C"/>
                                </svg>
                            </button>
                        </div>
                        <div className={styles.number}>
                            <label htmlFor="font-size">Font Size</label>
                            <input 
                            type="number"
                            id="font-size"
                            />
                        </div>
                        <div className={styles.number}>
                            <label htmlFor="font-weight">Font Weight</label>
                            <input 
                            type="number" 
                            id="font-weight"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['cell-properties']}>
                    <label htmlFor="">
                        Cell Properties
                    </label>
                    <div className={styles.properties}>
                        <ColorPicker 
                            ID={'cell-background-color'} 
                            // value={} 
                            // onChange={(value) => handleColorChange(value)} 
                        />
                        <div className={styles.number}>
                            <label htmlFor="padding">Padding</label>
                            <input 
                                type="number"
                                id="padding"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['border-properties']}>
                    <label htmlFor="">
                        Cell Border Properties
                    </label>
                    <div className={styles.properties}>
                        <ColorPicker 
                            ID={'cell-border-color'} 
                            // value={} 
                            // onChange={(value) => handleColorChange(value)} 
                        />
                        <Dropdown 
                            placeholder='Choose Type'
                            value={properties.border.type}
                            options={[
                            { label: 'Solid',value: 'solid' },
                            { label: 'Dashed', value: 'dashed' }
                            ]}
                            style={{
                                    button: {
                                        height: 30,
                                        padding: 15
                                    }
                                }
                            }
                        />
                        <div className={styles.side}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 10 10" fill="none">
                                <mask id="path-1-inside-1_1312_27" fill="white">
                                    <path d="M9 9H1V1H9V9ZM2.5 2.5V7.5H7.5V2.5H2.5Z"/>
                                </mask>
                                <path d="M9 9V9.05H9.05V9H9ZM1 9H0.95V9.05H1V9ZM1 1V0.95H0.95V1H1ZM9 1H9.05V0.95H9V1ZM2.5 2.5V2.45H2.45V2.5H2.5ZM2.5 7.5H2.45V7.55H2.5V7.5ZM7.5 7.5V7.55H7.55V7.5H7.5ZM7.5 2.5H7.55V2.45H7.5V2.5ZM9 9V8.95H7V9V9.05H9V9ZM3 9V8.95H1V9V9.05H3V9ZM1 9H1.05V7H1H0.95V9H1ZM1 3H1.05V1H1H0.95V3H1ZM1 1V1.05H3V1V0.95H1V1ZM7 1V1.05H9V1V0.95H7V1ZM9 1H8.95V3H9H9.05V1H9ZM9 7H8.95V9H9H9.05V7H9ZM2.5 2.5H2.45V3.75H2.5H2.55V2.5H2.5ZM2.5 6.25H2.45V7.5H2.5H2.55V6.25H2.5ZM2.5 7.5V7.55H3.75V7.5V7.45H2.5V7.5ZM6.25 7.5V7.55H7.5V7.5V7.45H6.25V7.5ZM7.5 7.5H7.55V6.25H7.5H7.45V7.5H7.5ZM7.5 3.75H7.55V2.5H7.5H7.45V3.75H7.5ZM7.5 2.5V2.45H6.25V2.5V2.55H7.5V2.5ZM3.75 2.5V2.45H2.5V2.5V2.55H3.75V2.5ZM9 9V9.1H9.1V9H9ZM1 9H0.9V9.1H1V9ZM1 1V0.9H0.9V1H1ZM9 1H9.1V0.9H9V1ZM2.5 2.5V2.4H2.4V2.5H2.5ZM2.5 7.5H2.4V7.6H2.5V7.5ZM7.5 7.5V7.6H7.6V7.5H7.5ZM7.5 2.5H7.6V2.4H7.5V2.5ZM9 9V8.9H7V9V9.1H9V9ZM3 9V8.9H1V9V9.1H3V9ZM1 9H1.1V7H1H0.9V9H1ZM1 3H1.1V1H1H0.9V3H1ZM1 1V1.1H3V1V0.9H1V1ZM7 1V1.1H9V1V0.9H7V1ZM9 1H8.9V3H9H9.1V1H9ZM9 7H8.9V9H9H9.1V7H9ZM2.5 2.5H2.4V3.75H2.5H2.6V2.5H2.5ZM2.5 6.25H2.4V7.5H2.5H2.6V6.25H2.5ZM2.5 7.5V7.6H3.75V7.5V7.4H2.5V7.5ZM6.25 7.5V7.6H7.5V7.5V7.4H6.25V7.5ZM7.5 7.5H7.6V6.25H7.5H7.4V7.5H7.5ZM7.5 3.75H7.6V2.5H7.5H7.4V3.75H7.5ZM7.5 2.5V2.4H6.25V2.5V2.6H7.5V2.5ZM3.75 2.5V2.4H2.5V2.5V2.6H3.75V2.5Z" fill="#8D8D8D" mask="url(#path-1-inside-1_1312_27)"/>
                                <path style={{ opacity: properties.border.sides.left ? 1 : 0}} onClick={() => toggleSide('left')} className={styles.left} d="M2.49707 7.50293L1.01707 8.98293C1.01077 8.98923 1 8.98477 1 8.97586V1.02414C1 1.01523 1.01077 1.01077 1.01707 1.01707L2.49707 2.49707C2.49895 2.49895 2.5 2.50149 2.5 2.50414V7.49586C2.5 7.49851 2.49895 7.50105 2.49707 7.50293Z" fill="#353535" stroke="#C6C6C6" stroke-width="0.1"/>
                                <path style={{ opacity: properties.border.sides.top ? 1 : 0}} onClick={() => toggleSide('top')} className={styles.top} d="M2.49707 2.49707L1.01707 1.01707C1.01077 1.01077 1.01523 1 1.02414 1L8.97586 1C8.98477 1 8.98923 1.01077 8.98293 1.01707L7.50293 2.49707C7.50105 2.49895 7.49851 2.5 7.49586 2.5L2.50414 2.5C2.50149 2.5 2.49895 2.49895 2.49707 2.49707Z" fill="#353535" stroke="#C6C6C6" stroke-width="0.1"/>
                                <path style={{ opacity: properties.border.sides.right ? 1 : 0}} onClick={() => toggleSide('right')} className={styles.right} d="M7.50293 2.49707L8.98293 1.01707C8.98923 1.01077 9 1.01523 9 1.02414L9 8.97586C9 8.98477 8.98923 8.98923 8.98293 8.98293L7.50293 7.50293C7.50105 7.50105 7.5 7.49851 7.5 7.49586L7.5 2.50414C7.5 2.50149 7.50105 2.49895 7.50293 2.49707Z" fill="#353535" stroke="#C6C6C6" stroke-width="0.1"/>
                                <path style={{ opacity: properties.border.sides.bottom ? 1 : 0}} onClick={() => toggleSide('bottom')} className={styles.bottom} d="M7.50293 7.50293L8.98293 8.98293C8.98923 8.98923 8.98477 9 8.97586 9L1.02414 9C1.01523 9 1.01077 8.98923 1.01707 8.98293L2.49707 7.50293C2.49895 7.50105 2.50149 7.5 2.50414 7.5L7.49586 7.5C7.49851 7.5 7.50105 7.50105 7.50293 7.50293Z" fill="#353535" stroke="#C6C6C6" stroke-width="0.1"/>
                            </svg>
                        </div>
                        <div className={styles.number}>
                            <label htmlFor="thickness">Thickness</label>
                            <input 
                                type="number"
                                id="thickness"
                            />
                        </div>
                        <div className={styles.number}>
                            <label htmlFor="dash">Dash</label>
                            <input 
                                type="number"
                                id="dash"
                            />
                        </div>
                        <div className={styles.number}>
                            <label htmlFor="radius">Radius</label>
                            <input 
                                type="number"
                                id="radius"
                            />
                        </div>
                    </div>
                </div>
                <button className={styles.delete} onClick={onDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={25}>
                    <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
                    </svg>
                </button>
                </div>
            )}
        </div>
    );
});

Table.displayName = "Table";
export default Table;