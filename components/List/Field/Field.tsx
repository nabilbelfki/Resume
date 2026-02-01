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
  value?: FieldValue;
}

interface FieldComponentProps {
  field: FieldProps;
  onChange: (value: FieldValue) => void;
  backgroundColor?: string;
  hasError?: boolean;
  fieldErrors?: Record<string, boolean>; // Add this new prop
}

type MediaValue = {
  name: string;
  path: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

type FieldValue = string | number | MediaValue;

const Field: React.FC<FieldComponentProps> = React.memo(({ 
  field, 
  onChange, 
  backgroundColor, 
  hasError,
  fieldErrors = {}
}) => {
  const commonValue = (typeof field.value === 'string' || typeof field.value === 'number') ? field.value : '';
  const commonProps = {
    value: commonValue,
    placeholder: field.placeholder || field.label || '',
    onChange: (value: FieldValue) => onChange(value),
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
          value={typeof field.value === 'string' ? field.value : ''}
          placeholder={commonProps.placeholder}
          onChange={(value) => onChange(value ?? '')}
          style={{ outline: hasError ? '1.6px solid red' : '' }}
        />
      );
    case 'dropdown':
      return (
        <Dropdown 
          options={field.options || []}
          value={typeof field.value === 'string' ? field.value : ''}
          placeholder={commonProps.placeholder}
          onChange={(value) => onChange(value ?? '')}
          style={{
            button: {
              border: hasError ? '1.6px solid red' : '' 
            } 
          }}
        />
      );
    case 'media':
      const mediaValue = typeof field.value === 'object' && field.value !== null
        ? (field.value as MediaValue)
        : { name: '', path: '', width: undefined, height: undefined };
      return (
        <div className={styles['media-field']}>
          <MediaPicker 
            value={{
              name: mediaValue.name || '',
              path: mediaValue.path || '',
              width: mediaValue.width,
              height: mediaValue.height,
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

Field.displayName = "Field";

export default Field;
