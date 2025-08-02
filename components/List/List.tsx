import React, { useState, useCallback, useEffect } from "react";
import styles from "./List.module.css";
import Row from "./Row/Row";

interface Field {
  id: string;
  type: 'text' | 'number' | 'date' | 'color' | 'dropdown' | 'media';
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value?: any;
}

interface ListProps {
  fields: Field[];
  onFieldChange: (items: any[]) => void;
  columns?: 2 | 3;
}

interface RowItem {
  id: number;
  fields: Field[];
}

const List: React.FC<ListProps> = ({ fields, onFieldChange, columns = 2 }) => {
  const [rows, setRows] = useState<RowItem[]>(() => [
    { id: Date.now(), fields: fields.map(field => ({ ...field })) }
  ]);

  // Store pending changes and flush them after render
  const [pendingChanges, setPendingChanges] = useState<any[] | null>(null);

  useEffect(() => {
    if (pendingChanges) {
      onFieldChange(pendingChanges);
      setPendingChanges(null);
    }
  }, [pendingChanges, onFieldChange]);

  const handleAdd = useCallback((index: number) => {
    const newId = Date.now();
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.splice(index + 1, 0, {
        id: newId,
        fields: fields.map(field => ({ ...field }))
      });
      return newRows;
    });
  }, [fields]);

  const handleDelete = useCallback((index: number) => {
    if (rows.length <= 1) return;
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  }, [rows.length]);

  const handleFieldChange = useCallback((rowId: number, fieldId: string, value: any) => {
    setRows(prevRows => {
      const updatedRows = prevRows.map(row => 
        row.id === rowId 
          ? {
              ...row,
              fields: row.fields.map(field => 
                field.id === fieldId 
                  ? { ...field, value } 
                  : field
              )
            } 
          : row
      );
      
      // Convert rows to the format expected by onFieldChange
      const items = updatedRows.map(row => 
        row.fields.reduce((acc, field) => ({ ...acc, [field.id]: field.value }), {})
      );
      
      // Schedule the update for after render
      setPendingChanges(items);
      return updatedRows;
    });
  }, []);

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const draggedRow = newRows[dragIndex];
      newRows.splice(dragIndex, 1);
      newRows.splice(hoverIndex, 0, draggedRow);
      return newRows;
    });
  }, []);

  return (
    <div className={styles.list}>
      {rows.map((row, index) => (
        <Row
          key={row.id}
          row={row}
          index={index}
          columns={columns}
          disableDelete={rows.length === 1}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onFieldChange={handleFieldChange}
          moveRow={moveRow}
        />
      ))}
    </div>
  );
};

export default List;