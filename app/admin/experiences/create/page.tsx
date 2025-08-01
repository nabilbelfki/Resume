"use client"
import React, { useState } from "react";
import styles from "./Experience.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload"

interface ExperienceData {
  level: number;
  zIndex: number;
  name: string;
  location: string;
  type: string | null;
  logo: {
    opened: {
      name: string;
      path: string;
      width: number;
      height: number;
      backgroundColor?: string;
    },
    closed: {
      name: string;
      path: string;
      width: number;
      height: number;
      backgroundColor?: string;
    }
  },
  title: string;
  subtitle: string;
  period: {
    title: string;
    start: string;
    end: string;
  },
  color: {
    line: string;
    name: string;
    title: string;
    subtitle: string;
    type: string;
    date: string;
    location: string;
    background: string;
    details: string;
    description: {
      text: string;
      background: string;
    }
  },
  description: string;
}

const Experience: React.FC = () => {
  const [isFrontAndBackSame, setIsFrontAndBackSame] = useState(true);
  const [frontLogo, setFrontLogo] = useState<{ name: string; path: string; backgroundColor?: string }>({ 
    name: '', 
    path: '' 
  });
  const [backLogo, setBackLogo] = useState<{ name: string; path: string; backgroundColor?: string }>({ 
    name: '', 
    path: '' 
  });
  
  const [formData, setFormData] = useState<ExperienceData>({
    level: 0,
    zIndex: 0,
    name: '',
    location: '',
    type: '',
    logo: {
      opened: {
        name: '',
        path: '',
        width: 0,
        height: 0
      },
      closed: {
        name: '',
        path: '',
        width: 0,
        height: 0
      }
    },
    title: '',
    subtitle: '',
    period: {
      title: '',
      start: '',
      end: '',
    },
    color: {
      line: '',
      name: '',
      title: '',
      subtitle: '',
      type: '',
      date: '',
      location: '',
      background: '',
      details: '',
      description: {
        text: '',
        background: '',
      }
    },
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs: breadcrumb[] = [
    { label: 'Experiences', href: '/admin/experiences' },
    { label: 'All Experiences', href: '/admin/experiences' },
    { label: 'Create Experience', href: '/admin/experiences/create' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id.startsWith('logoOpened')) {
      const field = id.replace('logoOpened', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          opened: {
            ...prev.logo.opened,
            [field]: field === 'name' || field === 'path' ? value : Number(value)
          }
        }
      }));
    } else if (id.startsWith('logoClosed')) {
      const field = id.replace('logoClosed', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          closed: {
            ...prev.logo.closed,
            [field]: field === 'name' || field === 'path' ? value : Number(value)
          }
        }
      }));
    } else if (id === 'periodStart' || id === 'periodEnd' || id === 'periodTitle') {
      setFormData(prev => ({
        ...prev,
        period: {
          ...prev.period,
          [id === 'periodStart' ? 'start' : 
           id === 'periodEnd' ? 'end' : 'title']: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleColorChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.') as [keyof ExperienceData['color'], string];
      setFormData(prev => ({
        ...prev,
        color: {
          ...prev.color,
          [parent]: {
            ...(prev.color[parent] as object),
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        color: {
          ...prev.color,
          [field as keyof ExperienceData['color']]: value
        }
      }));
    }
  };

  const handleFrontLogoChange = (media: { name: string; path: string; backgroundColor?: string }) => {
    setFrontLogo(media);
    if (isFrontAndBackSame) {
      setBackLogo(media);
      setFormData(prev => ({
        ...prev,
        logo: {
          opened: {
            ...prev.logo.opened,
            name: media.name,
            path: media.path,
            backgroundColor: media.backgroundColor
          },
          closed: {
            ...prev.logo.closed,
            name: media.name,
            path: media.path,
            backgroundColor: media.backgroundColor
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          opened: {
            ...prev.logo.opened,
            name: media.name,
            path: media.path,
            backgroundColor: media.backgroundColor
          }
        }
      }));
    }
  };

  const handleBackLogoChange = (media: { name: string; path: string; backgroundColor?: string }) => {
    setBackLogo(media);
    setFormData(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        closed: {
          ...prev.logo.closed,
          name: media.name,
          path: media.path,
          backgroundColor: media.backgroundColor
        }
      }
    }));
  };

  const handleToggleSameLogo = () => {
    const newValue = !isFrontAndBackSame;
    setIsFrontAndBackSame(newValue);
    
    if (newValue && frontLogo.name) {
      // If toggling to "same" and front logo exists, use it for both
      setBackLogo(frontLogo);
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          closed: {
            ...prev.logo.closed,
            name: frontLogo.name,
            path: frontLogo.path,
            backgroundColor: frontLogo.backgroundColor
          }
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || !formData.title || !formData.period.start) {
        throw new Error('Name, title, and start date are required');
      }

      // Ensure logo data is properly set
      const finalFormData = {
        ...formData,
        logo: {
          opened: {
            ...formData.logo.opened,
            name: frontLogo.name,
            path: frontLogo.path,
            backgroundColor: frontLogo.backgroundColor,
            width: formData.logo.opened.width,
            height: formData.logo.opened.height
          },
          closed: {
            ...formData.logo.closed,
            name: isFrontAndBackSame ? frontLogo.name : backLogo.name,
            path: isFrontAndBackSame ? frontLogo.path : backLogo.path,
            backgroundColor: isFrontAndBackSame ? frontLogo.backgroundColor : backLogo.backgroundColor,
            width: formData.logo.closed.width,
            height: formData.logo.closed.height
          }
        }
      };

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create experience');
      }

      window.location.href = '/admin/experiences';
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
          onClick={() => window.location.href = '/admin/experiences'}
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
        <div className={styles['front-and-back']}>
          <div className={styles.avatarContainer}>
            <label>{ isFrontAndBackSame ? 'Thumbnail' : 'Front' }</label>
            <ThumbnailUpload 
              value={frontLogo}
              onChange={handleFrontLogoChange}
            />
          </div>
          {!isFrontAndBackSame && (
            <div className={styles.avatarContainer}>
              <label>Back</label>
              <ThumbnailUpload  
                value={backLogo}
                onChange={handleBackLogoChange}
              />
            </div>
          )}
        </div>
        <div className={styles.same}>
          <label htmlFor="same">Separate<br /> Thumbnails</label>
          <input 
            id="same" 
            type="checkbox" 
            checked={!isFrontAndBackSame}
            onChange={handleToggleSameLogo}
          />
        </div>
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
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              placeholder="Enter Title" 
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="subtitle">Subtitle</label>
            <input 
              type="text" 
              id="subtitle" 
              placeholder="Enter Subtitle" 
              value={formData.subtitle}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="type">Type</label>
            <Dropdown 
              placeholder='Choose Type' 
              options={[
                { label: 'Work', value: 'Work' },
                { label: 'Education', value: 'Education' },
              ]}
              value={formData.type}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  type: value
                }))
              }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              placeholder="Enter Location" 
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="level">Level</label>
            <input 
              type="number" 
              id="level" 
              placeholder="Enter Level" 
              value={formData.level}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.textbox}>
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <label className={styles.title}>Time Period</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="periodTitle">Period Title</label>
            <input 
              type="text" 
              id="periodTitle" 
              placeholder="Enter Title" 
              value={formData.period.title}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="periodStart">Start Date</label>
            <input 
              type="date" 
              id="periodStart" 
              value={formData.period.start}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="periodEnd">End Date</label>
            <input 
              type="date" 
              id="periodEnd" 
              value={formData.period.end}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <label className={styles.title}>Logo Constraints</label>
        <div className={styles.grid} style={{gridTemplateColumns: '1fr 1fr'}}>
          <div className={styles.input}>
            <label htmlFor="logoOpenedWidth">Opened Width</label>
            <input 
              type="number" 
              id="logoOpenedWidth" 
              placeholder="Enter Width" 
              value={formData.logo.opened.width}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="logoClosedWidth">Closed Width</label>
            <input 
              type="number" 
              id="logoClosedWidth" 
              placeholder="Enter Width" 
              value={formData.logo.closed.width}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="logoOpenedHeight">Opened Height</label>
            <input 
              type="number" 
              id="logoOpenedHeight" 
              placeholder="Enter Height" 
              value={formData.logo.opened.height}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="logoClosedHeight">Closed Height</label>
            <input 
              type="number" 
              id="logoClosedHeight" 
              placeholder="Enter Height" 
              value={formData.logo.closed.height}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <label className={styles.title}>Colors</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label>Line</label>
            <ColorPicker 
              ID="line-color" 
              placeholder="Enter Line Color"
              value={formData.color.line}
              onChange={(value) => handleColorChange('line', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Name</label>
            <ColorPicker 
              ID="name-color" 
              placeholder="Enter Name Color"
              value={formData.color.name}
              onChange={(value) => handleColorChange('name', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Type</label>
            <ColorPicker 
              ID="type-color" 
              placeholder="Enter Type Color"
              value={formData.color.type}
              onChange={(value) => handleColorChange('type', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Title</label>
            <ColorPicker 
              ID="title-color" 
              placeholder="Enter Title Color"
              value={formData.color.title}
              onChange={(value) => handleColorChange('title', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Subtitle</label>
            <ColorPicker 
              ID="subtitle-color" 
              placeholder="Enter Subtitle Color"
              value={formData.color.subtitle}
              onChange={(value) => handleColorChange('subtitle', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Date</label>
            <ColorPicker 
              ID="date-color" 
              placeholder="Enter Date Color"
              value={formData.color.date}
              onChange={(value) => handleColorChange('date', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Location</label>
            <ColorPicker 
              ID="location-color" 
              placeholder="Enter Location Color"
              value={formData.color.location}
              onChange={(value) => handleColorChange('location', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Background</label>
            <ColorPicker 
              ID="background-color" 
              placeholder="Enter Background Color"
              value={formData.color.background}
              onChange={(value) => handleColorChange('background', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Details</label>
            <ColorPicker 
              ID="details-color" 
              placeholder="Enter Details Color"
              value={formData.color.details}
              onChange={(value) => handleColorChange('details', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Description Text</label>
            <ColorPicker 
              ID="description-text-color" 
              placeholder="Enter Description Text Color"
              value={formData.color.description.text}
              onChange={(value) => handleColorChange('description.text', value)}
            />
          </div>
          <div className={styles.input}>
            <label>Description Background</label>
            <ColorPicker 
              ID="description-bg-color" 
              placeholder="Enter Description Background Color"
              value={formData.color.description.background}
              onChange={(value) => handleColorChange('description.background', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;