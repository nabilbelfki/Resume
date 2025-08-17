import React, {useCallback} from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "./Row.module.css";
import Field from "../Field/Field";

interface field {
  id: string;
  type: 'text' | 'number' | 'date' | 'color' | 'dropdown' | 'media';
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value?: any;
}

interface RowItem {
  id: number;
  fields: field[];
}

interface RowProps {
  row: RowItem;
  index: number;
  columns: number;
  disableDelete: boolean;
  onAdd: (index: number) => void;
  onDelete: (index: number) => void;
  onFieldChange: (rowId: number, fieldId: string, value: any) => void;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  rowErrors: Record<string, boolean>;
}

const Row: React.FC<RowProps> = React.memo(({ 
  row, 
  index, 
  columns, 
  disableDelete, 
  onAdd, 
  onDelete, 
  onFieldChange,
  moveRow,
  rowErrors
}) => {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const dragHandleRef = React.useRef<HTMLDivElement>(null);
  const [isTallRow, setIsTallRow] = React.useState(false);

    React.useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { height } = entry.contentRect;
          setIsTallRow(height > 50);
        }
      });

      if (rowRef.current) {
        observer.observe(rowRef.current);
      }

      return () => {
        if (rowRef.current) {
          observer.unobserve(rowRef.current);
        }
      };
    }, []);

    const [{ isDragging }, drag, preview] = useDrag({
    type: "ROW",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "ROW",
    hover: (item: { index: number }, monitor) => {
      if (!rowRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveRow(dragIndex, hoverIndex); // Use the moveRow from props
      item.index = hoverIndex;
    },
  });

  drag(dragHandleRef);
  preview(rowRef);
  drop(rowRef);

    return (
      <div ref={rowRef} className={styles.row} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div 
          ref={dragHandleRef} 
          className={styles.drag}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 4 6" fill="none">
            <rect y="0.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
            <rect x="2.92114" y="0.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
            <rect x="2.92114" y="2.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
            <rect x="2.92114" y="4.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
            <rect y="4.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
            <rect y="2.5" width="0.973684" height="1" rx="0.2" fill="#727272"/>
          </svg>
        </div>
        <div className={`${styles.fields} ${columns === 2 ? styles['two-columns'] : styles['three-columns']}`}>
          {row.fields.map(field => {
            // Find the color value for this row
            const colorField = row.fields.find(f => f.id === 'color');
            const backgroundColor = colorField?.value;
            
             return (
              <Field
                key={field.id}
                field={field}
                onChange={(value) => onFieldChange(row.id, field.id, value)}
                backgroundColor={field.type === 'media' ? backgroundColor : undefined}
                hasError={rowErrors[field.id]}
                fieldErrors={rowErrors}
              />
            );
            })}
        </div>
        <div className={`${styles.actions} ${isTallRow ? styles['column-layout'] : ''}`}>
          <button className={styles.add} onClick={() => onAdd(index)}>Add</button>
          <button className={styles.delete} onClick={() => onDelete(index)} disabled={disableDelete}>Delete</button>
        </div>
      </div>
    );
  });

  export default Row;