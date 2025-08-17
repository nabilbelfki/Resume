import React, { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import styles from "./Table.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import ColorPicker from "@/components/ColorPicker/ColorPicker";

interface Record {
    cells: Cell[];
}

interface Cell {
    text: {
        value: string;
        family: string;
        size: number;
        weight: number;
        color: string;
        textAlign: 'left' | 'center' | 'right';
    },
    color: string;
    padding: number;
    border: {
        type: 'solid' | 'dashed';
        dash?: number;
        color: string;
        sides: {
            top: boolean;
            left: boolean;
            right: boolean;
            bottom: boolean;
        }
        thickness: number;
        radius: {
            topLeft: number;
            topRight: number;
            bottomLeft: number;
            bottomRight: number;
        }
    }
}

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
    },
    records: Record[];
}

interface TableProps {
    editable: boolean;
    content: string;
    onFocus: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onContentUpdate: (content: string) => void;
    onDelete: () => void;
    onEnter: () => void;
}

// Helper to convert data to JSON string for storage
const serializeTableData = (data: Record[]) => JSON.stringify(data);
// Helper to parse JSON string back to data
const deserializeTableData = (json: string): Record[] => {
    try {
        const data = JSON.parse(json);
        if (Array.isArray(data) && data.every(record => Array.isArray(record.cells))) {
            return data;
        }
        // Return default 2x2 table if parsing fails
        return createInitialTableData(2, 2);
    } catch (e) {
        return createInitialTableData(2, 2);
    }
};

// Create initial table data with default cells
const createInitialTableData = (rows: number, columns: number): Record[] => {
    return Array(rows).fill(null).map(() => ({
        cells: Array(columns).fill(null).map(() => ({
            text: {
                value: '',
                family: 'Inter',
                size: 16,
                weight: 300,
                color: '#4C4C4C',
                textAlign: 'left',
            },
            color: '#ECECEC',
            padding: 5,
            border: {
                type: 'solid',
                dash: 0,
                color: '#FFFFFF',
                sides: {
                    top: true,
                    left: true,
                    right: true,
                    bottom: true,
                },
                thickness: 2,
                radius: {
                    topLeft: 0,
                    topRight: 0,
                    bottomLeft: 0,
                    bottomRight: 0,
                }
            }
        }))
    }));
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(({
    editable,
    content,
    onFocus,
    onContentUpdate,
    onDelete,
    onEnter,
    onArrowUp = () => {},
    onArrowDown = () => {}
}, ref) => {
    const radiusRef = useRef<HTMLDivElement>(null);
    const [isRadii, setIsRadii] = useState(false);
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
        },
        records: []
    });
    const [tableData, setTableData] = useState<Record[]>(deserializeTableData(content));
    const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
    const lastSelectedRef = useRef<{row: number, col: number} | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Handle radius picker
            if (isRadii && radiusRef.current && !radiusRef.current.contains(event.target as Node)) {
                setIsRadii(false);
            }

            // Handle toolbar visibility
            const toolbarElement = document.querySelector(`.${styles.toolbar}`);
            const tableElement = internalRef.current;
            
            if (isToolbarVisible && 
                tableElement && 
                !tableElement.contains(event.target as Node) && 
                toolbarElement && 
                !toolbarElement.contains(event.target as Node)
            ) {
                setIsToolbarVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isRadii, isToolbarVisible]);

    // Update internal state when content prop changes
    useEffect(() => {
        setTableData(deserializeTableData(content));
    }, [content]);

    // Handle input in table cells
    const handleCellInput = (e: React.FormEvent<HTMLTableCellElement>, rowIndex: number, colIndex: number) => {
        const newTableData = [...tableData];
        newTableData[rowIndex].cells[colIndex].text.value = e.currentTarget.innerHTML;
        setTableData(newTableData);
        onContentUpdate(serializeTableData(newTableData));
    };

    const handleTableClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolbarVisible(true);
    };

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newRowCount = parseInt(e.target.value, 10);
        if (newRowCount < 1) newRowCount = 1;
        const currentRowCount = properties.rows;
        const difference = newRowCount - currentRowCount;
        
        // Update table data first
        if (difference > 0) {
            // Add rows to the end
            setTableData(prevData => {
                const newRows = Array(difference).fill(null).map(() => ({
                    cells: Array(prevData[0]?.cells.length || 2).fill(null).map(() => ({
                        ...prevData[0]?.cells[0] || createInitialTableData(1, 1)[0].cells[0],
                        text: {
                            ...prevData[0]?.cells[0]?.text || createInitialTableData(1, 1)[0].cells[0].text,
                            value: ''
                        }
                    }))
                }));
                const updatedData = [...prevData, ...newRows];
                onContentUpdate(serializeTableData(updatedData));
                return updatedData;
            });
        } else if (difference < 0) {
            // Remove rows from the end
            setTableData(prevData => {
                const updatedData = prevData.slice(0, newRowCount);
                onContentUpdate(serializeTableData(updatedData));
                return updatedData;
            });
        }
        
        // Then update properties
        setProperties(prev => ({
            ...prev,
            rows: newRowCount,
        }));
    };

    const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newColumnCount = parseInt(e.target.value, 10);
        if (newColumnCount < 1) newColumnCount = 1;
        const currentColumnCount = properties.columns;
        const difference = newColumnCount - currentColumnCount;
        
        // Update table data first
        if (difference > 0) {
            // Add columns to the end
            setTableData(prevData => {
                const updatedData = prevData.map(row => ({
                    ...row,
                    cells: [...row.cells, ...Array(difference).fill(null).map(() => ({
                        ...row.cells[0],
                        text: {
                            ...row.cells[0].text,
                            value: ''
                        }
                    }))]
                }));
                onContentUpdate(serializeTableData(updatedData));
                return updatedData;
            });
        } else if (difference < 0) {
            // Remove columns from the end
            setTableData(prevData => {
                const updatedData = prevData.map(row => ({
                    ...row,
                    cells: row.cells.slice(0, newColumnCount)
                }));
                onContentUpdate(serializeTableData(updatedData));
                return updatedData;
            });
        }
        
        // Then update properties
        setProperties(prev => ({
            ...prev,
            columns: newColumnCount,
        }));
    };

    // Helper to get cell at position
    const getCell = useCallback((row: number, col: number) => {
        return tableData[row]?.cells[col];
    }, [tableData]);

    const lastCursorOffset = useRef<number>(0);
    const cellRefs = useRef<{ [key: string]: HTMLTableCellElement }>({});

    // Save cursor position
    const saveCursorOffset = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return;
        
        lastCursorOffset.current = range.startOffset;
    };

    // Restore cursor position
    const restoreCursorOffset = (element: HTMLElement, offset: number) => {
        const selection = window.getSelection();
        if (!selection) return;

        const textContent = element.textContent || '';
        const adjustedOffset = Math.min(offset, textContent.length);
        
        const range = document.createRange();
        const textNode = findFirstTextNode(element);
        
        if (textNode) {
            range.setStart(textNode, adjustedOffset);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    // Helper to find first text node
    const findFirstTextNode = (node: Node): Text | null => {
        if (node.nodeType === Node.TEXT_NODE) return node as Text;
        
        for (let i = 0; i < node.childNodes.length; i++) {
            const found = findFirstTextNode(node.childNodes[i]);
            if (found) return found;
        }
        
        return null;
    };

    // Handle cell navigation with arrow keys
    const handleCellKeyDown = (e: KeyboardEvent<HTMLTableCellElement>, rowIndex: number, colIndex: number) => {
        saveCursorOffset();

        if (!editable) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                console.log(rowIndex)
                if (rowIndex > 0) {
                    navigateToCell(rowIndex - 1, colIndex);
                } else {
                    console.log("Changing")
                    onArrowUp()
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (rowIndex < tableData.length - 1) {
                    navigateToCell(rowIndex + 1, colIndex);
                } else {
                    onArrowDown()
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (colIndex > 0) {
                    navigateToCell(rowIndex, colIndex - 1);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (colIndex < tableData[0]?.cells.length - 1) {
                    navigateToCell(rowIndex, colIndex + 1);
                }
                break;
            case 'Enter':
                e.preventDefault();
                onEnter();
                break;
            case 'Tab':
                e.preventDefault();
                if (e.shiftKey) {
                    // Shift+Tab - move left or up
                    if (colIndex > 0) {
                        navigateToCell(rowIndex, colIndex - 1);
                    } else if (rowIndex > 0) {
                        navigateToCell(rowIndex - 1, tableData[0].cells.length - 1);
                    }
                } else {
                    // Tab - move right or down
                    if (colIndex < tableData[0]?.cells.length - 1) {
                        navigateToCell(rowIndex, colIndex + 1);
                    } else if (rowIndex < tableData.length - 1) {
                        navigateToCell(rowIndex + 1, 0);
                    }
                }
                break;
        }
    };

    // Navigate to specific cell
    const navigateToCell = (row: number, col: number) => {
        const cellId = `${row}-${col}`;
        const cellElement = cellRefs.current[cellId];
        
        if (cellElement) {
            setSelectedCells([{row, col}]);
            lastSelectedRef.current = {row, col};
            cellElement.focus();
            restoreCursorOffset(cellElement, lastCursorOffset.current);
        }
    };

    // Handle cell click
    const handleCellClick = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        setIsToolbarVisible(true);
        e.stopPropagation();
        onFocus();

        if (e.shiftKey && lastSelectedRef.current) {
            // Select range of cells between last selected and current
            const startRow = Math.min(lastSelectedRef.current.row, rowIndex);
            const endRow = Math.max(lastSelectedRef.current.row, rowIndex);
            const startCol = Math.min(lastSelectedRef.current.col, colIndex);
            const endCol = Math.max(lastSelectedRef.current.col, colIndex);

            const newSelected = [];
            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    if (tableData[r]?.cells[c]) {
                        newSelected.push({row: r, col: c});
                    }
                }
            }
            setSelectedCells(newSelected);
        } else if (e.ctrlKey || e.metaKey) {
            // Add/remove from selection
            const existingIndex = selectedCells.findIndex(
                cell => cell.row === rowIndex && cell.col === colIndex
            );
            
            if (existingIndex >= 0) {
                setSelectedCells(prev => prev.filter((_, i) => i !== existingIndex));
            } else {
                setSelectedCells(prev => [...prev, {row: rowIndex, col: colIndex}]);
            }
            lastSelectedRef.current = {row: rowIndex, col: colIndex};
        } else {
            // Single selection
            setSelectedCells([{row: rowIndex, col: colIndex}]);
            lastSelectedRef.current = {row: rowIndex, col: colIndex};
        }
    };

    // Update selected cells' properties
    const updateSelectedCells = (updater: (cell: Cell) => Cell) => {
        if (selectedCells.length === 0) return;

        setTableData(prevData => {
            const newData = [...prevData];
            selectedCells.forEach(({row, col}) => {
                if (newData[row]?.cells[col]) {
                    newData[row].cells[col] = updater({...newData[row].cells[col]});
                }
            });
            onContentUpdate(serializeTableData(newData));
            return newData;
        });
    };

    // Handle text alignment change
    const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
        updateSelectedCells(cell => ({
            ...cell,
            text: {
                ...cell.text,
                textAlign: align
            }
        }));
    };

    // Handle font family change
    const handleFontFamilyChange = (family: string | null) => {
        updateSelectedCells(cell => ({
            ...cell,
            text: {
                ...cell.text,
                family: family !== null ? family : cell.text.family
            }
        }));
    };

    // Handle font size change
    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value, 10);
        if (!isNaN(size)) {
            updateSelectedCells(cell => ({
                ...cell,
                text: {
                    ...cell.text,
                    size
                }
            }));
        }
    };

    // Handle font weight change
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseInt(e.target.value, 10);
        if (!isNaN(weight)) {
            updateSelectedCells(cell => ({
                ...cell,
                text: {
                    ...cell.text,
                    weight
                }
            }));
        }
    };

    // Handle text color change
    const handleTextColorChange = (color: string) => {
        updateSelectedCells(cell => ({
            ...cell,
            text: {
                ...cell.text,
                color
            }
        }));
    };

    // Handle cell background color change
    const handleCellColorChange = (color: string) => {
        updateSelectedCells(cell => ({
            ...cell,
            color
        }));
    };

    // Handle padding change
    const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const padding = parseInt(e.target.value, 10);
        if (!isNaN(padding)) {
            updateSelectedCells(cell => ({
                ...cell,
                padding
            }));
        }
    };

    // Handle border side toggle
    const toggleSide = (side: 'top' | 'right' | 'left' | 'bottom') => {
        updateSelectedCells(cell => ({
            ...cell,
            border: {
                ...cell.border,
                sides: {
                    ...cell.border.sides,
                    [side]: !cell.border.sides[side]
                }
            }
        }));
    };

    // Handle border thickness change
    const handleBorderThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const thickness = parseInt(e.target.value, 10);
        if (!isNaN(thickness)) {
            updateSelectedCells(cell => ({
                ...cell,
                border: {
                    ...cell.border,
                    thickness
                }
            }));
        }
    };

    // Handle border type change
    const handleBorderTypeChange = (type: string | null) => {
        updateSelectedCells(cell => ({
            ...cell,
            border: {
                ...cell.border,
                type: type === 'solid' || type === 'dashed' ? type : cell.border.type
            }
        }));
    };

    // Handle border color change
    const handleBorderColorChange = (color: string) => {
        updateSelectedCells(cell => ({
            ...cell,
            border: {
                ...cell.border,
                color
            }
        }));
    };

    // Handle border radius change
    const handleBorderRadiusChange = (side: keyof Cell['border']['radius'], value: number) => {
        updateSelectedCells(cell => ({
            ...cell,
            border: {
                ...cell.border,
                radius: {
                    ...cell.border.radius,
                    [side]: value
                }
            }
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

    const renderCell = (row: Record, rowIndex: number, cell: Cell, colIndex: number) => {
        const isSelected = selectedCells.some(
            c => c.row === rowIndex && c.col === colIndex
        );
        const cellId = `${rowIndex}-${colIndex}`;

        return (
            <td
                key={colIndex}
                ref={el => {
                    if (el) cellRefs.current[cellId] = el;
                    else delete cellRefs.current[cellId];
                }}
                className={`${styles.cell} ${isSelected ? styles.selected : ''}`}
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onInput={(e) => handleCellInput(e, rowIndex, colIndex)}
                onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                style={{
                    backgroundColor: cell.color,
                    padding: `${cell.padding}px`,
                    borderColor: cell.border.color,
                    borderStyle: cell.border.type,
                    borderWidth: `${cell.border.thickness}px`,
                    borderTopWidth: cell.border.sides.top ? `${cell.border.thickness}px` : '0',
                    borderRightWidth: cell.border.sides.right ? `${cell.border.thickness}px` : '0',
                    borderBottomWidth: cell.border.sides.bottom ? `${cell.border.thickness}px` : '0',
                    borderLeftWidth: cell.border.sides.left ? `${cell.border.thickness}px` : '0',
                    borderRadius: `${cell.border.radius.topLeft}px ${cell.border.radius.topRight}px ${cell.border.radius.bottomRight}px ${cell.border.radius.bottomLeft}px`,
                    fontFamily: cell.text.family,
                    fontSize: `${cell.text.size}px`,
                    color: cell.text.color,
                    textAlign: cell.text.textAlign,
                }}
            />
        );
    };

    return (
        <div 
            className={styles.container} 
            onFocus={onFocus}
        >
            <table
                ref={refToUse}
                className={`${styles.table} ${isToolbarVisible ? styles.focused : ''}`}
                onClick={handleTableClick}
            >
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.cells.map((cell, colIndex) => 
                                renderCell(row, rowIndex, cell, colIndex)
                            )}
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
                            min="1"
                        />
                    </div>
                    <div className={styles.columns}>
                        <label htmlFor="columns">Columns</label>
                        <input 
                            value={properties.columns}
                            onChange={handleColumnChange}
                            type="number" 
                            id="columns"
                            min="1"
                        />
                    </div>
                    <div className={styles['text-properties']}>
                        <label>Text Properties</label>
                        <div className={styles.properties}>
                            <ColorPicker 
                                ID={'text-color'} 
                                value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.text.color : ''}
                                onChange={handleTextColorChange}
                            />
                            <Dropdown 
                                placeholder='Choose Font'
                                value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.text.family : ''}
                                options={[
                                    { label: 'Inter', value: 'Inter' },
                                    { label: 'Open Sans', value: 'san-serif' }
                                ]}
                                onChange={handleFontFamilyChange}
                                style={{
                                    button: {
                                        height: 30,
                                        padding: 15
                                    }
                                }}
                            />
                            <div className={styles.alignment}>
                                <button 
                                    className={selectedCells.length > 0 && getCell(selectedCells[0].row, selectedCells[0].col)?.text.textAlign === 'left' ? styles.selected : ''}
                                    onClick={() => handleTextAlignChange('left')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 5" fill="none">
                                        <rect width="4" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                        <rect y="2.3999" width="4" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                        <rect y="1.19995" width="3" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                        <rect y="3.6001" width="3" height="0.5" rx="0.1" fill="#4C4C4C"/>
                                    </svg>
                                </button>
                                <button 
                                    className={selectedCells.length > 0 && getCell(selectedCells[0].row, selectedCells[0].col)?.text.textAlign === 'center' ? styles.selected : ''}
                                    onClick={() => handleTextAlignChange('center')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 5" fill="none">
                                        <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 0)" fill="#4C4C4C"/>
                                        <rect width="4" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 4 2.3999)" fill="#4C4C4C"/>
                                        <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 3.5 1.19995)" fill="#4C4C4C"/>
                                        <rect width="3" height="0.5" rx="0.1" transform="matrix(-1 0 0 1 3.5 3.6001)" fill="#4C4C4C"/>
                                    </svg>
                                </button>
                                <button 
                                    className={selectedCells.length > 0 && getCell(selectedCells[0].row, selectedCells[0].col)?.text.textAlign === 'right' ? styles.selected : ''}
                                    onClick={() => handleTextAlignChange('right')}
                                >
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
                                    value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.text.size : ''}
                                    onChange={handleFontSizeChange}
                                    min="1"
                                />
                            </div>
                            {/*<div className={styles.number}>
                                <label htmlFor="font-weight">Font Weight</label>
                                <input 
                                    type="number" 
                                    id="font-weight"
                                    value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.text.weight : ''}
                                    onChange={handleFontWeightChange}
                                    min="100"
                                    max="900"
                                    step="100"
                                />
                            </div>*/}
                        </div>
                    </div>
                    <div className={styles['cell-properties']}>
                        <label>Cell Properties</label>
                        <div className={styles.properties}>
                            <ColorPicker 
                                ID={'cell-background-color'} 
                                value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.color : ''}
                                onChange={handleCellColorChange}
                            />
                            <div className={styles.number}>
                                <label htmlFor="padding">Padding</label>
                                <input 
                                    type="number"
                                    id="padding"
                                    value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.padding : ''}
                                    onChange={handlePaddingChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles['border-properties']}>
                        <label>Cell Border Properties</label>
                        <div className={styles.properties}>
                            <ColorPicker 
                                ID={'cell-border-color'} 
                                value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.color : ''}
                                onChange={handleBorderColorChange}
                            />
                            <Dropdown 
                                placeholder='Choose Type'
                                value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.type : 'solid'}
                                options={[
                                    { label: 'Solid', value: 'solid' },
                                    { label: 'Dashed', value: 'dashed' }
                                ]}
                                onChange={handleBorderTypeChange}
                                style={{
                                    button: {
                                        height: 30,
                                        padding: 15
                                    }
                                }}
                            />
                            <div className={styles.side}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 10 10" fill="none">
                                    <mask id="path-1-inside-1_1312_27" fill="white">
                                        <path d="M9 9H1V1H9V9ZM2.5 2.5V7.5H7.5V2.5H2.5Z"/>
                                    </mask>
                                    <path d="M9 9V9.05H9.05V9H9ZM1 9H0.95V9.05H1V9ZM1 1V0.95H0.95V1H1ZM9 1H9.05V0.95H9V1ZM2.5 2.5V2.45H2.45V2.5H2.5ZM2.5 7.5H2.45V7.55H2.5V7.5ZM7.5 7.5V7.55H7.55V7.5H7.5ZM7.5 2.5H7.55V2.45H7.5V2.5ZM9 9V8.95H7V9V9.05H9V9ZM3 9V8.95H1V9V9.05H3V9ZM1 9H1.05V7H1H0.95V9H1ZM1 3H1.05V1H1H0.95V3H1ZM1 1V1.05H3V1V0.95H1V1ZM7 1V1.05H9V1V0.95H7V1ZM9 1H8.95V3H9H9.05V1H9ZM9 7H8.95V9H9H9.05V7H9ZM2.5 2.5H2.45V3.75H2.5H2.55V2.5H2.5ZM2.5 6.25H2.45V7.5H2.5H2.55V6.25H2.5ZM2.5 7.5V7.55H3.75V7.5V7.45H2.5V7.5ZM6.25 7.5V7.55H7.5V7.5V7.45H6.25V7.5ZM7.5 7.5H7.55V6.25H7.5H7.45V7.5H7.5ZM7.5 3.75H7.55V2.5H7.5H7.45V3.75H7.5ZM7.5 2.5V2.45H6.25V2.5V2.55H7.5V2.5ZM3.75 2.5V2.45H2.5V2.5V2.55H3.75V2.5ZM9 9V9.1H9.1V9H9ZM1 9H0.9V9.1H1V9ZM1 1V0.9H0.9V1H1ZM9 1H9.1V0.9H9V1ZM2.5 2.5V2.4H2.4V2.5H2.5ZM2.5 7.5H2.4V7.6H2.5V7.5ZM7.5 7.5V7.6H7.6V7.5H7.5ZM7.5 2.5H7.6V2.4H7.5V2.5ZM9 9V8.9H7V9V9.1H9V9ZM3 9V8.9H1V9V9.1H3V9ZM1 9H1.1V7H1H0.9V9H1ZM1 3H1.1V1H1H0.9V3H1ZM1 1V1.1H3V1V0.9H1V1ZM7 1V1.1H9V1V0.9H7V1ZM9 1H8.9V3H9H9.1V1H9ZM9 7H8.9V9H9H9.1V7H9ZM2.5 2.5H2.4V3.75H2.5H2.6V2.5H2.5ZM2.5 6.25H2.4V7.5H2.5H2.6V6.25H2.5ZM2.5 7.5V7.6H3.75V7.5V7.4H2.5V7.5ZM6.25 7.5V7.6H7.5V7.5V7.4H6.25V7.5ZM7.5 7.5H7.6V6.25H7.5H7.4V7.5H7.5ZM7.5 3.75H7.6V2.5H7.5H7.4V3.75H7.5ZM7.5 2.5V2.4H6.25V2.5V2.6H7.5V2.5ZM3.75 2.5V2.4H2.5V2.5V2.6H3.75V2.5Z" fill="#8D8D8D" mask="url(#path-1-inside-1_1312_27)"/>
                                    <path 
                                        style={{ opacity: selectedCells.length > 0 ? (getCell(selectedCells[0].row, selectedCells[0].col)?.border.sides.left ? 1 : 0) : 0 }} 
                                        onClick={() => toggleSide('left')} 
                                        className={styles.left} 
                                        d="M2.49707 7.50293L1.01707 8.98293C1.01077 8.98923 1 8.98477 1 8.97586V1.02414C1 1.01523 1.01077 1.01077 1.01707 1.01707L2.49707 2.49707C2.49895 2.49895 2.5 2.50149 2.5 2.50414V7.49586C2.5 7.49851 2.49895 7.50105 2.49707 7.50293Z" 
                                        fill="#353535" 
                                        stroke="#C6C6C6" 
                                        strokeWidth="0.1"
                                    />
                                    <path 
                                        style={{ opacity: selectedCells.length > 0 ? (getCell(selectedCells[0].row, selectedCells[0].col)?.border.sides.top ? 1 : 0) : 0 }} 
                                        onClick={() => toggleSide('top')} 
                                        className={styles.top} 
                                        d="M2.49707 2.49707L1.01707 1.01707C1.01077 1.01077 1.01523 1 1.02414 1L8.97586 1C8.98477 1 8.98923 1.01077 8.98293 1.01707L7.50293 2.49707C7.50105 2.49895 7.49851 2.5 7.49586 2.5L2.50414 2.5C2.50149 2.5 2.49895 2.49895 2.49707 2.49707Z" 
                                        fill="#353535" 
                                        stroke="#C6C6C6" 
                                        strokeWidth="0.1"
                                    />
                                    <path 
                                        style={{ opacity: selectedCells.length > 0 ? (getCell(selectedCells[0].row, selectedCells[0].col)?.border.sides.right ? 1 : 0) : 0 }} 
                                        onClick={() => toggleSide('right')} 
                                        className={styles.right} 
                                        d="M7.50293 2.49707L8.98293 1.01707C8.98923 1.01077 9 1.01523 9 1.02414L9 8.97586C9 8.98477 8.98923 8.98923 8.98293 8.98293L7.50293 7.50293C7.50105 7.50105 7.5 7.49851 7.5 7.49586L7.5 2.50414C7.5 2.50149 7.50105 2.49895 7.50293 2.49707Z" 
                                        fill="#353535" 
                                        stroke="#C6C6C6" 
                                        strokeWidth="0.1"
                                    />
                                    <path 
                                        style={{ opacity: selectedCells.length > 0 ? (getCell(selectedCells[0].row, selectedCells[0].col)?.border.sides.bottom ? 1 : 0) : 0 }} 
                                        onClick={() => toggleSide('bottom')} 
                                        className={styles.bottom} 
                                        d="M7.50293 7.50293L8.98293 8.98293C8.98923 8.98923 8.98477 9 8.97586 9L1.02414 9C1.01523 9 1.01077 8.98923 1.01707 8.98293L2.49707 7.50293C2.49895 7.50105 2.50149 7.5 2.50414 7.5L7.49586 7.5C7.49851 7.5 7.50105 7.50105 7.50293 7.50293Z" 
                                        fill="#353535" 
                                        stroke="#C6C6C6" 
                                        strokeWidth="0.1"
                                    />
                                </svg>
                            </div>
                            <div className={styles.number}>
                                <label htmlFor="thickness">Thickness</label>
                                <input 
                                    type="number"
                                    id="thickness"
                                    value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.thickness : ''}
                                    onChange={handleBorderThicknessChange}
                                    min="0"
                                />
                            </div>
                            {/* <div className={styles.number}>
                                <label htmlFor="dash">Dash</label>
                                <input 
                                    type="number"
                                    id="dash"
                                    value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.dash : ''}
                                    onChange={(e) => {
                                        const dash = parseInt(e.target.value, 10);
                                        if (!isNaN(dash)) {
                                            updateSelectedCells(cell => ({
                                                ...cell,
                                                border: {
                                                    ...cell.border,
                                                    dash
                                                }
                                            }));
                                        }
                                    }}
                                    min="0"
                                />
                            </div> */}
                            <div className={`${styles.number} ${styles.radius}`}>
                                {isRadii ? (
                                    <div className={styles.corners} ref={radiusRef}>
                                        <input 
                                            type="number"
                                            value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.radius.topLeft : ''}
                                            onChange={(e) => handleBorderRadiusChange('topLeft', parseInt(e.target.value, 10))}
                                            min="0"
                                        />
                                        <input 
                                            type="number"
                                            value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.radius.topRight : ''}
                                            onChange={(e) => handleBorderRadiusChange('topRight', parseInt(e.target.value, 10))}
                                            min="0"
                                        />
                                        <input 
                                            type="number"
                                            value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.radius.bottomLeft : ''}
                                            onChange={(e) => handleBorderRadiusChange('bottomLeft', parseInt(e.target.value, 10))}
                                            min="0"
                                        />
                                        <input 
                                            type="number"
                                            value={selectedCells.length > 0 ? getCell(selectedCells[0].row, selectedCells[0].col)?.border.radius.bottomRight : ''}
                                            onChange={(e) => handleBorderRadiusChange('bottomRight', parseInt(e.target.value, 10))}
                                            min="0"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <label htmlFor="radius">Radius</label>
                                        <div className={styles.icon} onClick={() => setIsRadii(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="11" viewBox="0 0 13 13" fill="none">
                                                <path d="M4.8 0C4.91046 0 5 0.0895431 5 0.2V1.8C5 1.91046 4.91046 2 4.8 2H2.2C2.08954 2 2 2.08954 2 2.2V4.8C2 4.91046 1.91046 5 1.8 5H0.2C0.0895431 5 0 4.91046 0 4.8V0.2C0 0.0895429 0.089543 0 0.2 0H4.8Z" fill="#4C4C4C"/>
                                                <path d="M12.8 0C12.9105 0 13 0.089543 13 0.2V4.8C13 4.91046 12.9105 5 12.8 5H11.2C11.0895 5 11 4.91046 11 4.8V2.2C11 2.08954 10.9105 2 10.8 2H8.2C8.08954 2 8 1.91046 8 1.8V0.2C8 0.0895431 8.08954 0 8.2 0H12.8Z" fill="#4C4C4C"/>
                                                <path d="M13 12.8C13 12.9105 12.9105 13 12.8 13H8.2C8.08954 13 8 12.9105 8 12.8V11.2C8 11.0895 8.08954 11 8.2 11H10.8C10.9105 11 11 10.9105 11 10.8V8.2C11 8.08954 11.0895 8 11.2 8H12.8C12.9105 8 13 8.08954 13 8.2V12.8Z" fill="#4C4C4C"/>
                                                <path d="M2 10.8C2 10.9105 2.08954 11 2.2 11H4.8C4.91046 11 5 11.0895 5 11.2V12.8C5 12.9105 4.91046 13 4.8 13H0.2C0.0895429 13 0 12.9105 0 12.8V8.2C0 8.08954 0.0895431 8 0.2 8H1.8C1.91046 8 2 8.08954 2 8.2V10.8Z" fill="#4C4C4C"/>
                                            </svg>
                                        </div>
                                        <input 
                                            type="number"
                                            id="radius"
                                            value={selectedCells.length > 0 ? (
                                                getCell(selectedCells[0].row, selectedCells[0].col)?.border.radius.topLeft || 0
                                            ) : ''}
                                            onChange={(e) => {
                                                const radius = parseInt(e.target.value, 10);
                                                if (!isNaN(radius)) {
                                                    updateSelectedCells(cell => ({
                                                        ...cell,
                                                        border: {
                                                            ...cell.border,
                                                            radius: {
                                                                topLeft: radius,
                                                                topRight: radius,
                                                                bottomRight: radius,
                                                                bottomLeft: radius
                                                            }
                                                        }
                                                    }));
                                                }
                                            }}
                                            min="0"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className={styles.delete} onClick={onDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={30}>
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