"use client"
import React, { useState, useEffect } from "react";
import styles from "./Media.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Upload from "@/components/Upload/Upload";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Media as MediaType } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";

const Media: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Media', href: '/admin/media' },
    { label: 'All Media', href: '/admin/media' },
    { label: isEditing ? 'Edit Media' : 'Upload Media', href: `/admin/media/${id ? 'edit/' + id : 'create'}` }
  ];

  // Fetch media data if editing
  useEffect(() => {
    if (id) {
      const fetchMedia = async () => {
        try {
          const response = await fetch(`/api/media/${id}`);
          if (!response.ok) throw new Error('Failed to fetch media');
          const media = await response.json();
          console.log("Media", media)
          setFormData({
            name: media.fileName,
            path: media.path,
            description: media.description,
            type: media.fileType,
            size: media.fileSize,
            backgroundColor: media.backgroundColor,
            file: undefined
          });
          setIsEditing(true);
        } catch (error) {
          console.error('Error fetching media:', error);
          setError('Failed to load media data');
        }
      };
      fetchMedia();
    }
  }, [id]);

  // Clean up blob URLs
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
    if (!formData.file && !formData.path) errors.file = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setError('Please fill all required fields');
      return;
    }

    try {
      if (isEditing) {
        // Determine if we're updating just metadata or uploading a new file
        if (formData.file) {
          // File upload with metadata
          const formDataToSend = new FormData();
          formDataToSend.append('file', formData.file);
          formDataToSend.append('fileName', formData.name);
          formDataToSend.append('fileType', formData.type || '');
          formDataToSend.append('description', formData.description);
          formDataToSend.append('backgroundColor', formData.backgroundColor || '#FFFFFF');

          const response = await fetch(`/api/media/${id}`, {
            method: 'PUT',
            body: formDataToSend
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Update failed');
          }

          const result = await response.json();
          console.log('Update successful:', result);
          router.push('/admin/media');

        } else {
          // Metadata-only update
          const response = await fetch(`/api/media/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: formData.name,
              fileType: formData.type,
              description: formData.description,
              backgroundColor: formData.backgroundColor
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Update failed');
          }

          const result = await response.json();
          console.log('Update successful:', result);
          router.push('/admin/media');
        }

      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this media item? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      console.log('Media deleted successfully');
      router.push('/admin/media');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Delete failed');
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
          onClick={() => router.push('/admin/media')}
          disabled={isSubmitting}
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
          {isSubmitting ? (isEditing ? 'Saving...' : 'Uploading...') : (isEditing ? 'Save Changes' : 'Upload Media')}
        </button>
        {isEditing && (
          <button 
            className={styles.delete} 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Media'}
          </button>
        )}
      </div>
      {/* {error && <div className={styles.error}>{error}</div>} */}
      <div className={styles.content}>
        <Upload 
          value={{
            name: formData.name,
            path: formData.path,
            type: formData.type
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
              value={`${((formData.size || 0) / 1024).toFixed(2)} KB`}
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
            }}
            style={{ border: validationErrors.description ? '1.6px solid red' : '' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Media;