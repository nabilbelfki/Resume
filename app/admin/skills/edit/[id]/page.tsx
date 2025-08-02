"use client"
import React, { useState, useEffect } from "react";
import styles from "./Skill.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useParams, useRouter } from "next/navigation";

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
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        if (!id) return;

        try {
          setLoading(true);
          const response = await fetch(`/api/skills/${id}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch skill`);
          }

          const data = await response.json();
          setFormData({
            type: data.type || '',
            name: data.name || '',
            image: {
              name: data.image.name || '',
              url: data.image.url || '',
              backgroundColor: data.image.backgroundColor || '',
              width: data.image.width || '',
              height: data.image.height || '',
            },
            status: data.status || '',
            description: {
              color: data.description.color || '',
              text: data.description.text || '',
              backgroundColor: data.description.backgroundColor || '',
            }
          })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
          console.error('Error fetching user:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [id]);

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
      label: 'Edit Skill',
      href: '/admin/skills/edit/' + id
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
  };

  const handleThumbnailChange = (media: { name: string; path: string }) => {
    setFormData(prev => ({
      ...prev,
      image: {
        ...prev.image,
        name: media.name,
        url: `${media.path}${media.name}`
      }
    }));
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete skill');
      }

      console.log('Skill deleted successfully');
      router.push('/admin/skills');
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image.name) {
      alert("Please select a thumbnail");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // Ensure image data is properly formatted
        image: {
          name: formData.image.name,
          url: formData.image.url.replace(formData.image.name,''),
          backgroundColor: formData.image.backgroundColor || '#ffffff',
          width: formData.image.width || 100,
          height: formData.image.height || 100,
        },
        description: {
          color: formData.description.color || '#000000',
          text: formData.description.text || '',
          backgroundColor: formData.description.backgroundColor || '#ffffff',
        }
      };

      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/skills/${id}` : '/api/skills';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save skill');
      }

      const result = await response.json();
      console.log('Skill saved successfully:', result);
      
      router.push(`/admin/skills`);
    } catch (err) {
      console.error('Error saving skill:', err);
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
        <button 
          className={styles.delete} 
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Deleting...' : 'Delete User'}
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
          }}
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
                {label:'Cloud', value: 'cloud'},
                {label:'Miscellaneous', value: 'miscellaneous'},
              ]}
              value={formData.type}
              onChange={(value) => setFormData({...formData, type: value})}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="status">Status</label>
            <Dropdown 
              placeholder='Choose Status' 
              options={[{label:'Active', value: 'Active'}, {label:'Inactive', value: 'Inactive'}]}
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value})}
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
            />
          </div>
          <div className={styles.input}>
              <label htmlFor="image-background-color">Background Color</label>
              <ColorPicker 
                ID="image-background-color" 
                placeholder="Enter Background Color"
                value={formData.image.backgroundColor}
                onChange={(value) => setFormData({
                  ...formData, 
                  image: {
                    ...formData.image,
                    backgroundColor: value
                  }
                })}
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
              onChange={(value) => setFormData({
                ...formData, 
                description: {
                  ...formData.description,
                  backgroundColor: value
                }
              })}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="description-color">Color</label>
            <ColorPicker 
              ID="description-color" 
              placeholder="Enter Color"
              value={formData.description.color}
              onChange={(value) => setFormData({
                ...formData, 
                description: {
                  ...formData.description,
                  color: value
                }
              })}
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
            onChange={(e) => setFormData({
              ...formData,
              description: {
                ...formData.description,
                text: e.target.value
              }
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default Skill;