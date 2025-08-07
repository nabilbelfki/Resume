import React, { useRef, useEffect, useState } from "react";
import styles from "./Table.module.css";

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
        <div className={styles.tableWrapper} onFocus={onFocus}>
            <table
                ref={refToUse}
                className={styles.table}
                onKeyDown={handleTableKeyDown}
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
            <div className={styles.controls}>
                <button className={styles.controlButton} onClick={addRow}>+ Row</button>
                <button className={styles.controlButton} onClick={addColumn}>+ Col</button>
            </div>
        </div>
    );
});

Table.displayName = "Table";
export default Table;