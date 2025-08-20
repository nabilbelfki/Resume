"use client"
import React, { useState } from "react";
import styles from "./Skill.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import Dropdown from "@/components/Dropdown/Dropdown";

interface SkillData {
  type: string | null;
  name: string;
  image: {
    name: string;
    url: string;
    backgroundColor: string;
    width: number | null;
    height: number | null;
  };
  status: string | null;
  description: {
    color: string;
    text: string;
    backgroundColor: string;
  }
}

const Skill: React.FC = () => {
  const [formData, setFormData] = useState<SkillData>({
    type: '',
    name: '',
    image: {
      name: '',
      url: '',
      backgroundColor: '',
      width: null,
      height: null,
    },
    status: '',
    description: {
      color: '',
      text: '',
      backgroundColor: '',
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    {
      label: 'Skills',
      href: '/admin/skills'
    },
    {
      label: 'All Skills',
      href: '/admin/skills'
    },
    {
      label: 'Create Skill',
      href: '/admin/skills/create'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`ID: ${id}`, value)

    if (id in formData) {
      console.log('In User')
      setFormData({
        ...formData,
        [id]: value
      });
    } else if (id in formData.image!) {
      console.log('In Address')
      setFormData({
        ...formData,
        image: {
          ...formData.image,
          [id]: value
        }
      });
    } else if (id in formData.description!) {
      console.log('In Address')
      setFormData({
        ...formData,
        description: {
          ...formData.description,
          [id]: value
        }
      });
    }
    console.log(formData);
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
    if (!formData.status) errors.status = true;
    if (!formData.image.name) errors.imageName = true;
    if (!formData.image.height) errors.height = true;
    if (!formData.image.width) errors.width = true;
    if (!formData.image.backgroundColor) errors.imageBackgroundColor = true;
    if (!formData.description.backgroundColor) errors.descriptionBackgroundColor = true;
    if (!formData.description.color) errors.descriptionColor = true;
    if (!formData.description.text) errors.descriptionText = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the data to send
      const dataToSend = {
        name: formData.name,
        type: formData.type,
        status: formData.status || 'Active',
        image: {
          name: formData.image.name,
          url: formData.image.url.replace(formData.image.name,''),
          backgroundColor: formData.image.backgroundColor || '#ffffff',
          width: formData.image.width ? Number(formData.image.width) : 100,
          height: formData.image.height ? Number(formData.image.height) : 100,
        },
        description: {
          text: formData.description.text,
          color: formData.description.color || '#000000',
          backgroundColor: formData.description.backgroundColor || '#ffffff',
        }
      };

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create skill');
      }

      const result = await response.json();
      console.log('Skill created successfully:', result);
      
      // Redirect to skills list
      window.location.href = '/admin/skills';
    } catch (err) {
      console.error('Error creating skill:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
        <button className={styles.back} onClick={()=>location.href = '/admin/skills'}>
          <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
        <ThumbnailUpload 
          value={{
            name: formData.image.name,
            path: formData.image.url.substring(0, formData.image.url.lastIndexOf('/') + 1),
            backgroundColor: formData.image.backgroundColor
          }}
          onChange={(media) => {
            setFormData(prev => ({
              ...prev,
              image: {
                ...prev.image,
                name: media.name,
                url: `${media.path}${media.name}`,
                backgroundColor: media.backgroundColor || prev.image.backgroundColor
              }
            }));
            if (validationErrors.imageName) {
              setValidationErrors(prev => ({ ...prev, imageName: false }));
            }
          }}
          style={{ border: validationErrors.imageName ? '1.6px solid red' : '' }}
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
                {label:'Mobile', value: 'mobile'}, 
                {label:'Frontend', value: 'frontend'},
                {label:'Backend', value: 'backend'},
                {label:'Database', value: 'database'},
                {label:'Cloud', value: 'cloud'},
                {label:'Miscellaneous', value: 'miscellaneous'},
              ]}
              value={formData.type}
              onChange={(value) => {
                setFormData({...formData, type: value})
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
            <label htmlFor="status">Status</label>
            <Dropdown 
              placeholder='Choose Status' 
              options={[{label:'Active', value: 'Active'}, {label:'Inactive', value: 'Inactive'}]}
              value={formData.status}
              onChange={(value) => {
                setFormData({...formData, status: value})
                if (validationErrors.status) {
                  setValidationErrors(prev => ({ ...prev, status: false }));
                }
              }}
              style={{ 
                button: {
                  border: validationErrors.status ? '1.6px solid red' : '' 
                }
              }}
            />
          </div>
        </div>

        <label className={styles.title}>Image Information</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="height">Height</label>
            <input 
              type="number" 
              id="height" 
              placeholder="Enter Height" 
              value={formData.image?.height || ''}
              onChange={handleInputChange}
              style={{ border: validationErrors.height ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="width">Width</label>
            <input 
              type="number" 
              id="width" 
              placeholder="Enter Width" 
              value={formData.image?.width || ''}
              onChange={handleInputChange}
              style={{ border: validationErrors.width ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
              <label htmlFor="image-background-color">Background Color</label>
              <ColorPicker 
                ID="image-background-color" 
                placeholder="Enter Background Color"
                value={formData.image.backgroundColor}
                onChange={(value) => {
                  setFormData({
                    ...formData, 
                    image: {
                      ...formData.image,
                      backgroundColor: value
                    }
                  })
                  if (validationErrors.imageBackgroundColor) {
                    setValidationErrors(prev => ({ ...prev, imageBackgroundColor: false }));
                  }
                }}    
                style={{ border: validationErrors.imageBackgroundColor ? '1.6px solid red' : '' }}
              />
            </div>
        </div>

        <label className={styles.title}>Description Information</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="description-background-color">Background Color</label>
            <ColorPicker 
              ID="description-background-color" placeholder="Enter Background Color"
              value={formData.description.backgroundColor}
              onChange={(value) => {
                setFormData({
                  ...formData, 
                  description: {
                    ...formData.description,
                    backgroundColor: value
                  }
                })
                if (validationErrors.descriptionBackgroundColor) {
                  setValidationErrors(prev => ({ ...prev, descriptionBackgroundColor: false }));
                }
              }}    
              style={{ border: validationErrors.descriptionBackgroundColor ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="description-color">Color</label>
            <ColorPicker 
              ID="description-color" 
              placeholder="Enter Color"
              value={formData.description.color}
              onChange={(value) =>  {
                setFormData({
                  ...formData, 
                  description: {
                    ...formData.description,
                    color: value
                  }
                })
                if (validationErrors.descriptionColor) {
                  setValidationErrors(prev => ({ ...prev, descriptionColor: false }));
                }
              }}    
              style={{ border: validationErrors.descriptionColor ? '1.6px solid red' : '' }}
            />
          </div>
        </div>
        <div className={styles.textbox}>
          <label htmlFor="description">Description</label>
          <textarea 
            name="description" 
            id="description"
            placeholder="Enter Description"
            value={formData.description.text}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: {
                  ...formData.description,
                  text: e.target.value
                }
              })
              if (validationErrors.descriptionText) {
                setValidationErrors(prev => ({ ...prev, descriptionText: false }));
              }
            }}
            style={{ border: validationErrors.descriptionText ? '1.6px solid red' : '' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Skill;