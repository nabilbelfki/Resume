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

interface FieldComponentProps {
  field: FieldProps;
  onChange: (value: any) => void;
  backgroundColor?: string;
  hasError?: boolean;
  fieldErrors?: Record<string, boolean>; // Add this new prop
}

const Field: React.FC<FieldComponentProps> = React.memo(({ 
  field, 
  onChange, 
  backgroundColor, 
  hasError,
  fieldErrors = {}
}) => {
  const commonProps = {
    value: field.value || '',
    placeholder: field.placeholder || field.label || '',
    onChange: (value: any) => onChange(value),
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
          style={{ border: hasError ? '1.6px solid red' : '' }}
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
          style={{ border: hasError ? '1.6px solid red' : '' }}
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
          style={{ border: hasError ? '1.6px solid red' : '' }}
        />
      );
    case 'color':
      return (
        <ColorPicker 
          ID={`color-${field.id}`}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={commonProps.onChange}
          style={{ outline: hasError ? '1.6px solid red' : '' }}
        />
      );
    case 'dropdown':
      return (
        <Dropdown 
          options={field.options || []}
          value={commonProps.value}
          placeholder={commonProps.placeholder}
          onChange={commonProps.onChange}
          style={{
            button: {
              border: hasError ? '1.6px solid red' : '' 
            } 
          }}
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
            onChange={(media) => {
              onChange({
                name: media.name,
                path: media.path,
                width: media.width,
                height: media.height
              });
            }}
            invalidMedia={fieldErrors['thumbnail.image']}
            invalidWidth={fieldErrors['thumbnail.width']}
            invalidHeight={fieldErrors['thumbnail.height']}
          />
        </div>
      );
    default:
      return null;
  }
});

export default Field;