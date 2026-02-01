"use client"
import React, { useState } from "react";
import styles from "./Project.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import List from "@/components/List/List";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload"
import MediaPicker from "@/components/MediaPicker/MediaPicker";
import Dropdown from "@/components/Dropdown/Dropdown";

interface ProjectData {
  name: string;
  slug: string;
  url: string;
  status: string | null;
  duration: string;
  startDate: string;
  endDate: string;
  views: number;
  description: string;
  thumbnail: {
    name: string;
    path: string;
    backgroundColor?: string;
  };
  repositories: {
    github: string;
    docker: string;
    figma: string;
  };
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
  }>;
  tools: Array<{
    name: string;
    color: string;
    slug: string;
    url: string;
    thumbnail: {
      name: string;
      path: string;
      width?: number;
      height?: number;
    };
  }>;
  client: {
    location: {
      latitude: number;
      longitude: number;
    };
    logo: {
      name: string;
      path: string;
      width?: number;
      height?: number;
    };
    title: string;
    description: string;
    slides: Array<{
      name: string;
      thumbnail: {
        name: string;
        path: string;
        width?: number;
        height?: number;
      };
      color: string;
    }>;
  };
}

type LanguageItem = ProjectData["languages"][number];
type ToolItem = ProjectData["tools"][number];
type SlideItem = ProjectData["client"]["slides"][number];

const Project: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<{ name: string; path: string; backgroundColor?: string }>({ 
    name: '', 
    path: '' 
  });
  
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    slug: '',
    url: '',
    status: '',
    duration: '',
    startDate: '',
    endDate: '',
    views: 0,
    description: '',
    thumbnail: {
      name: '',
      path: '',
    },
    repositories: {
      github: '',
      docker: '',
      figma: ''
    },
    languages: [
      {
        name: '',
        percentage: 0,
        color: ''
      }
    ],
    tools: [
      {
        name: '',
        color: '',
        slug: '',
        url: '',
        thumbnail: {
          name: '',
          path: '',
          width: 0,
          height: 0,
        }
      }
    ],
    client: {
      location: {
        latitude: 0,
        longitude: 0
      },
      logo: {
        name: '',
        path: ''
      },
      title: '',
      description: '',
      slides: [
        {
          name: '',
          thumbnail: {
            name: '',
            path: '',
            width: 0,
            height: 0,
          },
          color: ''
        }
      ]
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Projects', href: '/admin/projects' },
    { label: 'All Projects', href: '/admin/projects' },
    { label: 'Create Project', href: '/admin/projects/create' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Clear validation error when user types
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: false }));
    }

    if (id.startsWith('repositories')) {
      const field = id.replace('repositories', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        repositories: {
          ...prev.repositories,
          [field]: value
        }
      }));
    } else if (id === 'clientLatitude' || id === 'clientLongitude') {
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          location: {
            ...prev.client.location,
            [id === 'clientLatitude' ? 'latitude' : 'longitude']: Number(value)
          }
        }
      }));
    } else if (id === 'clientTitle') {
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          title: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleThumbnailChange = (media: { name: string; path: string; backgroundColor?: string }) => {
    setThumbnail(media);
    setFormData(prev => ({
      ...prev,
      thumbnail: {
        name: media.name,
        path: media.path,
        backgroundColor: media.backgroundColor
      }
    }));
    if (validationErrors.thumbnail) {
      setValidationErrors(prev => ({ ...prev, thumbnail: false }));
    }
  };

  const handleLanguagesChange = (items: LanguageItem[]) => {
    const rowsToSave = items.length > 0 ? items : [{
      name: '',
      color: '',
      percentage: 0
    }];
    
    setFormData(prev => ({
      ...prev,
      languages: rowsToSave
    }));
    
    // Clear validation errors only for the changed fields in this list
    setValidationErrors(prev => {
      const newErrors = {...prev};
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`languages[${index}].name`];
        if (item.color) delete newErrors[`languages[${index}].color`];
        if (item.percentage) delete newErrors[`languages[${index}].percentage`];
      });
      return newErrors;
    });
  };

  const handleToolsChange = (items: ToolItem[]) => {
    const rowsToSave = items.length > 0 ? items : [{
      name: '',
      color: '',
      thumbnail: { name: '', path: '' },
      slug: '',
      url: ''
    }];
    
    setFormData(prev => ({
      ...prev,
      tools: rowsToSave
    }));
    
    // Clear validation errors only for the changed fields in this list
    setValidationErrors(prev => {
      const newErrors = {...prev};
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`tools[${index}].name`];
        if (item.color) delete newErrors[`tools[${index}].color`];
        if (item.slug) delete newErrors[`tools[${index}].slug`];
        if (item.url) delete newErrors[`tools[${index}].url`];
        // Clear all thumbnail-related errors if path exists
        if (item.thumbnail?.path) delete newErrors[`tools[${index}].thumbnail.image`];
        if (item.thumbnail?.width) delete newErrors[`tools[${index}].thumbnail.width`];
        if (item.thumbnail?.height) delete newErrors[`tools[${index}].thumbnail.height`];
        // if (item?.thumbnail.length === 0) delete newErrors[`tools[${index}].thumbnail`];
        
      });
      return newErrors;
    });
  };

  const handleClientSlidesChange = (items: SlideItem[]) => {
    const rowsToSave = items.length > 0 ? items : [{
      name: '',
      thumbnail: { name: '', path: '' },
      color: ''
    }];
    
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        slides: rowsToSave
      }
    }));
    
    // Clear validation errors only for the changed fields in this list
    setValidationErrors(prev => {
      const newErrors = {...prev};
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`client.slides[${index}].name`];
        if (item.color) delete newErrors[`client.slides[${index}].color`];
        // Clear all thumbnail-related errors if path exists
        if (item.thumbnail?.path) delete newErrors[`client.slides[${index}].thumbnail.image`];
        if (item.thumbnail?.width) delete newErrors[`client.slides[${index}].thumbnail.width`];
        if (item.thumbnail?.height) delete newErrors[`client.slides[${index}].thumbnail.height`];
        // if (item?.thumbnail.length === 0) delete newErrors[`client.slides[${index}].thumbnail`];
      });
      return newErrors;
    });
  };

  // Helper to transform errors for the List component
  const getListErrors = (
    listName: 'client.slides' | 'languages' | 'tools',
    items: Array<LanguageItem | ToolItem | SlideItem>
  ) => {
    const fieldNames: Record<'client.slides' | 'languages' | 'tools', string[]> = {
      'client.slides': [
        'name',
        'color',
        'thumbnail.image',
        'thumbnail.width',
        'thumbnail.height'
      ],
      languages: [
        'name',
        'color',
        'percentage'
      ],
      tools: [
        'name',
        'color',
        'slug',
        'url',
        'thumbnail.image',
        'thumbnail.width',
        'thumbnail.height'
      ]
    };

    return items.map((item, index) => {
      const fieldErrors: Record<string, boolean> = {};
      fieldNames[listName].forEach((fieldName) => {
        const errorKey = `${listName}[${index}].${fieldName}`;
        if (validationErrors[errorKey]) {
          // Map the error to a simpler key for the field component
          fieldErrors[fieldName] = true;
        }
      });
      return fieldErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.slug.trim()) errors.slug = true;
    if (!formData.url.trim()) errors.url = true;
    if (!formData.status) errors.status = true;
    if (!formData.duration.trim()) errors.duration = true;
    if (!formData.startDate) errors.startDate = true;
    if (!formData.endDate) errors.endDate = true;
    if (!formData.description.trim()) errors.description = true;
    if (!formData.repositories.github) errors.repositoriesGithub = true;
    if (!formData.repositories.docker) errors.repositoriesDocker = true;
    if (!formData.views) errors.views = true;
    if (!thumbnail.path) errors.thumbnail = true;

    console.log("Languages", formData.languages)
    formData.languages.forEach((lang, index) => {
      if (!lang?.name?.trim()) errors[`languages[${index}].name`] = true;
      if (!lang?.color?.trim()) errors[`languages[${index}].color`] = true;
      if (!lang?.percentage) errors[`languages[${index}].percentage`] = true;
    });

    console.log("Tools", formData.tools)
    formData.tools.forEach((tool, index) => {
      if (!tool.name) errors[`tools[${index}].name`] = true;
      if (!tool.slug) errors[`tools[${index}].slug`] = true;
      if (!tool.url) errors[`tools[${index}].url`] = true;
      if (!tool.color) errors[`tools[${index}].color`] = true;
      if (!tool.thumbnail?.path) errors[`tools[${index}].thumbnail.image`] = true;
      if (!tool.thumbnail?.width) errors[`tools[${index}].thumbnail.width`] = true;
      if (!tool.thumbnail?.height) errors[`tools[${index}].thumbnail.height`] = true;
    });
    
    if (!formData.client.title.trim()) errors.clientTitle = true;
    if (!formData.client.location.latitude) errors.clientLatitude = true;
    if (!formData.client.location.longitude) errors.clientLongitude = true;
    if (!formData.client.description.trim()) errors.clientDescription = true;

    if (!formData.client.logo.name) errors.clientImage = true;
    if (!formData.client.logo.width) errors.clientWidth = true;
    if (!formData.client.logo.height) errors.clientHeight = true;

    console.log("Slides", formData.client.slides)
    formData.client.slides.forEach((slide, index) => {
      if (!slide.name) errors[`client.slides[${index}].name`] = true;
      if (!slide.color) errors[`client.slides[${index}].color`] = true;
      if (!slide.thumbnail?.path) errors[`client.slides[${index}].thumbnail.image`] = true;
      if (!slide.thumbnail?.width) errors[`client.slides[${index}].thumbnail.width`] = true;
      if (!slide.thumbnail?.height) errors[`client.slides[${index}].thumbnail.height`] = true;
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const finalFormData = {
        name: formData.name,
        status: formData.status,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        views: formData.views,
        repository: {
          url: formData.repositories.github,
          shortUrl: formData.repositories.github.replace('https://www.', '').replace('http://www.', '').replace('www.', ''),
          type: 'Github'
        },
        thumbnail: {
          fileName: thumbnail.name,
          path: thumbnail.path,
          backgroundColor: thumbnail.backgroundColor,
          width: 200,
          height: 100
        },
        description: formData.description,
        slug: formData.slug,
        url: formData.url,
        languages: formData.languages,
        tools: formData.tools.map(tool => ({
          name: tool.name,
          slug: tool.slug,
          url: tool.url,
          color: tool.color,
          imagePath: tool.thumbnail.path + tool.thumbnail.name,
          width: tool.thumbnail.width,
          height: tool.thumbnail.height
        })),
        container: {
          url: formData.repositories.docker,
          shortUrl: formData.repositories.docker.replace('https://www.', '').replace('http://www.', '').replace('www.', ''),
          type: 'Docker'
        },
        client: {
          title: {
            name: formData.client.title,
            fontSize: 32
          },
          logo: {
            fileName: formData.client.logo.name,
            path: formData.client.logo.path,
            width: formData.client.logo.width || undefined,
            height: formData.client.logo.height || undefined
          },
          location: {
            latitude: formData.client.location.latitude,
            longitude: formData.client.location.longitude,
          },
          description: formData.description,
          slides: formData.client.slides.map(slide => ({
            name: slide.name,
            image: {
              src: slide.thumbnail.path + slide.thumbnail.name,
              width: slide.thumbnail.width || undefined,
              height: slide.thumbnail.height || undefined,
              alt: 'picture',
              backgroundColor: slide.color,
            }
          }))
        }
      };

      console.log("Submitting data:", finalFormData);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      window.location.href = '/admin/projects';
    } catch (err) {
      console.error('Error submitting form:', err);
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
          onClick={() => window.location.href = '/admin/projects'}
        >
          <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--form-back-button-icon)" stroke="none">
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
      {/* {error && <div className={styles.error}>{error}</div>} */}
      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <label>Thumbnail</label>
          <ThumbnailUpload 
            value={thumbnail}
            onChange={handleThumbnailChange}
            style={{ border: validationErrors.thumbnail ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.name ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="slug">Slug</label>
            <input 
              type="text" 
              id="slug" 
              placeholder="Enter Slug" 
              value={formData.slug}
              onChange={handleInputChange}
              style={{ border: validationErrors.slug ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="url">URL</label>
            <input 
              type="text" 
              id="url" 
              placeholder="Enter URL" 
              value={formData.url}
              onChange={handleInputChange}
              style={{ border: validationErrors.url ? '1.6px solid red' : '' }}
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
          <div className={styles.input}>
            <label htmlFor="startDate">Start Date</label>
            <input 
              type="date" 
              id="startDate" 
              placeholder="Enter Start Date" 
              value={formData.startDate}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.startDate ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="endDate">End Date</label>
            <input 
              type="date" 
              id="endDate" 
              placeholder="Enter End Date" 
              value={formData.endDate}
              onChange={handleInputChange}
              style={{ border: validationErrors.endDate ? '1.6px solid red' : '' }}
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
            style={{ border: validationErrors.description ? '1.6px solid red' : '' }}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="views">Views</label>
            <input 
              type="number" 
              id="views" 
              placeholder="Enter Views" 
              value={formData.views}
              onChange={handleInputChange}
              style={{ border: validationErrors.views ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="duration">Duration</label>
            <input 
              type="text" 
              id="duration" 
              placeholder="Enter Duration" 
              value={formData.duration}
              onChange={handleInputChange}
              style={{ border: validationErrors.duration ? '1.6px solid red' : '' }}
            />
          </div>
        </div>

        <label className={styles.title}>Repositories</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="repositoriesGithub">GitHub URL</label>
            <input 
              type="text" 
              id="repositoriesGithub" 
              placeholder="Enter GitHub URL" 
              value={formData.repositories.github}
              onChange={handleInputChange}
              style={{ border: validationErrors.repositoriesGithub ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="repositoriesDocker">Docker URL</label>
            <input 
              type="text" 
              id="repositoriesDocker" 
              placeholder="Enter Docker URL" 
              value={formData.repositories.docker}
              onChange={handleInputChange}
              style={{ border: validationErrors.repositoriesDocker ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="repositoriesFigma">Figma URL</label>
            <input 
              type="text" 
              id="repositoriesFigma" 
              placeholder="Enter Figma URL" 
              value={formData.repositories.figma}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <label className={styles.title} style={{marginBottom: 50}}>Languages</label>
        <div style={{marginTop: 30, marginBottom: 60}}>
          <List 
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Name' },
              { id: 'color', type: 'color', placeholder: 'Enter Color' },
              { id: 'percentage', type: 'number', placeholder: 'Enter Percentage' },
            ]}
            onFieldChange={(items) => handleLanguagesChange(items as LanguageItem[])}
            columns={3}
            fieldErrors={getListErrors('languages', formData.languages)}
          />
        </div>

        <label className={styles.title} style={{marginBottom: 50}}>Tools</label>
        <div style={{marginTop: 30, marginBottom: 60}}>
          <List 
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Name' },
              { id: 'color', type: 'color', placeholder: 'Enter Color' },
              { id: 'thumbnail', type: 'media', label: 'Thumbnail' },
              { id: 'slug', type: 'text', placeholder: 'Enter Slug' },
              { id: 'url', type: 'text', placeholder: 'Enter URL' },
            ]}
            onFieldChange={(items) => handleToolsChange(items as ToolItem[])}
            columns={3}
            fieldErrors={getListErrors('tools', formData.tools)}
          />
        </div>

        <label className={styles.title} style={{marginBottom: 50}}>Client</label>
        <div className={styles.grid}>
          <div className={styles['latitude-and-longitude']}>
            <div className={styles.input}>
              <label htmlFor="clientLatitude">Latitude</label>
              <input 
                type="number" 
                id="clientLatitude" 
                placeholder="Enter Latitude" 
                value={formData.client.location.latitude}
                onChange={handleInputChange}
                style={{ border: validationErrors.clientLatitude ? '1.6px solid red' : '' }}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="clientLongitude">Longitude</label>
              <input 
                type="number" 
                id="clientLongitude" 
                placeholder="Enter Longitude" 
                value={formData.client.location.longitude}
                onChange={handleInputChange}
                style={{ border: validationErrors.clientLongitude ? '1.6px solid red' : '' }}
              />
            </div>
          </div>
          <div className={styles.input}>
            <label>Logo</label>
            <MediaPicker 
              style={{height: 120}}
              value={{
                name: formData.client.logo.name,
                path: formData.client.logo.path,
                width: formData.client.logo.width,
                height: formData.client.logo.height
              }}
              onChange={(media) => {
                setFormData(prev => ({
                  ...prev,
                  client: {
                    ...prev.client,
                    logo: {
                      name: media.name,
                      path: media.path,
                      width: media.width,
                      height: media.height
                    }
                  }
                }));
                setValidationErrors(prev => {
                  const newErrors = {...prev};
                  if (media.path) delete newErrors.clientImage;
                  if (media.width) delete newErrors.clientWidth;
                  if (media.height) delete newErrors.clientHeight;
                  return newErrors;
                });
              }}
              invalidHeight={validationErrors.clientHeight}
              invalidWidth={validationErrors.clientWidth}
              invalidMedia={validationErrors.clientImage}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="clientTitle">Title</label>
            <input 
              type="text" 
              id="clientTitle" 
              placeholder="Enter Title" 
              value={formData.client.title}
              onChange={handleInputChange}
              style={{ border: validationErrors.clientTitle ? '1.6px solid red' : '' }}
            />
          </div>
        </div>

        <div className={styles.textbox}>
          <label htmlFor="clientDescription">Description</label>
          <textarea 
            id="clientDescription"
            placeholder="Enter Description"
            value={formData.client.description}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                client: {
                  ...prev.client,
                  description: e.target.value
                }
              }));
              if (validationErrors.clientDescription) {
                setValidationErrors(prev => ({ ...prev, clientDescription: false }));
              }
            }}
            style={{ border: validationErrors.clientDescription ? '1.6px solid red' : '' }}
          />
        </div>

        <div style={{marginTop: 30}}>
          <List 
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Slide Name' },
              { id: 'thumbnail', type: 'media', label: 'Thumbnail' },
              { id: 'color', type: 'color', placeholder: 'Enter Background Color' },
            ]}
            onFieldChange={(items) => handleClientSlidesChange(items as SlideItem[])}
            columns={2}
            fieldErrors={getListErrors('client.slides', formData.client.slides)}
          />
        </div>
      </div>
    </div>
  );
}

export default Project;
