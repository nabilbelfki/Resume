"use client"
import React, { useState, useEffect } from "react";
import styles from "./Media.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Upload from "@/components/Upload/Upload";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Media as MediaType } from "@/lib/types";

const Media: React.FC = () => {
  const [formData, setFormData] = useState<Omit<MediaType, '_id'> & { file?: File }>({
    name: '',
    path: '',
    description: '',
    type: 'Image',
    size: 0,
    backgroundColor: '#ffffff',
    file: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Media', href: '/admin/media' },
    { label: 'All Media', href: '/admin/media' },
    { label: 'Upload Media', href: '/admin/media/create' }
  ];

  useEffect(() => {
    return () => {
      if (formData.path.startsWith('blob:')) {
        URL.revokeObjectURL(formData.path);
      }
    };
  }, [formData.path]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear validation error when user types
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

        // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.name) errors.name = true;
    if (!formData.type) errors.type = true;
    if (!formData.description) errors.description = true;
    if (!formData.file) errors.file = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setError('Please fill all required fields');
      return;
    }

    try {
      if (!formData.file) {
        throw new Error('Please select a file to upload');
      }
      console.log("Data", formData);
      // Create new FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('type', formData.type || 'Image');
      formDataToSend.append('description', formData.description);
      console.log(formDataToSend)
      // Debug: Log FormData contents
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let browser set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      window.location.href = '/admin/media';
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
        <button 
          className={styles.back} 
          onClick={() => window.location.href = '/admin/media'}
        >
          <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#727272" stroke="none">
              <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
            </g>
          </svg>
          <span>Back</span>
        </button>
        <button 
          className={styles.save} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Media'}
        </button>
      </div>
      {/* {error && <div className={styles.error}>{error}</div>} */}
      <div className={styles.content}>
        <Upload 
          value={{
            name: formData.name,
            path: formData.path,
            type: formData.type || 'Image'
          }}
          onChange={(media) => {
            // Get file extension to determine type
            const fileExt = media.name.split('.').pop()?.toLowerCase() || '';
            let detectedType: 'Image' | 'Video' | 'Sound' = 'Image';
            
            if (['mp4', 'mov', 'avi', 'wmv'].includes(fileExt)) {
              detectedType = 'Video';
            } else if (['mp3', 'wav', 'ogg', 'aac'].includes(fileExt)) {
              detectedType = 'Sound';
            }

            if (media.file) {
              // Create preview URL only if file exists
              const previewUrl = URL.createObjectURL(media.file);
              setFormData(prev => ({
                ...prev,
                name: media.name,
                path: previewUrl,
                size: media.size || 0,
                type: detectedType,
                file: media.file
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                name: media.name,
                path: media.path,
                size: media.size || 0
              }));
            }

            // Clear validation error when value is selected
            if (validationErrors.file) {
              setValidationErrors(prev => ({ ...prev, file: false }));
            }
          }}
          style={{ border: validationErrors.file ? '1.6px solid red' : '' }}
        />
        <label className={styles.title}>General Information</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Enter Name" 
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.name ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="type">Type</label>
            <Dropdown 
              placeholder='Choose Type' 
              options={[
                {label:'Image', value: 'Image'}, 
                {label:'Video', value: 'Video'},
                {label:'Sound', value: 'Sound'}
              ]}
              value={formData.type}
              onChange={(value) => {
                // Optional: Allow manual override if needed
                setFormData(prev => ({
                  ...prev,
                  type: value as 'Image' | 'Video' | 'Sound'
                }))
                // Clear validation error when value is selected
                if (validationErrors.type) {
                  setValidationErrors(prev => ({ ...prev, type: false }));
                }
              }}
              style={{
                button: {
                  border: validationErrors.type ? '1.6px solid red' : '' 
                }
              }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="size">File Size</label>
            <input 
              type="text" 
              id="size" 
              placeholder="File Size" 
              value={`${((formData.size || 0) / 1024).toFixed(2)} KB`} // Fixed calculation
              disabled
            />
          </div>
        </div>

        <div className={styles.textbox}>
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))
              // Clear validation error when value is selected
              if (validationErrors.description) {
                setValidationErrors(prev => ({ ...prev, description: false }));
              }
            }
            }
            style={{ border: validationErrors.description ? '1.6px solid red' : '' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Media;