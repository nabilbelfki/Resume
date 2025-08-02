import React from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import MediaPicker from "@/components/MediaPicker/MediaPicker";
import styles from "./Field.module.css";

interface FieldProps {
  id: string;
  type: 'text' | 'number' | 'date' | 'color' | 'dropdown' | 'media';
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value?: any;
}

const Field: React.FC<{
  field: FieldProps;
  onChange: (value: any) => void;
  backgroundColor?: string;
}> = React.memo(({ field, onChange, backgroundColor }) => {
  const commonProps = {
    value: field.value || '',
    placeholder: field.placeholder || field.label || '',
    onChange: (value: any) => onChange(value), // Add onChange to commonProps
  };

  switch (field.type) {
    case 'text':
      return (
        <input 
          type="text" 
          className={styles.input}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'number':
      return (
        <input 
          type="number" 
          className={styles.input}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case 'date':
      return (
        <input 
          type="date" 
          className={styles.input}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'color':
      return (
        <ColorPicker 
          ID={`color-${field.id}`}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={commonProps.onChange}
        />
      );
    case 'dropdown':
      return (
        <Dropdown 
          options={field.options || []}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={commonProps.onChange}
        />
      );
    case 'media':
      return (
        <div className={styles['media-field']}>
          <MediaPicker 
            value={{
              name: field.value?.name || '',
              path: field.value?.path || '',
              width: field.value?.width,
              height: field.value?.height,
              backgroundColor: backgroundColor
            }}
            onChange={(media) => onChange({
              ...media,
              width: media.width,
              height: media.height
            })}
          />
        </div>
      );
    default:
      return null;
  }
});

export default Field;