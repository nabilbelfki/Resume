"use client"
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import styles from "./Project.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb } from "@/lib/types";
import List from "@/components/List/List";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload"
import MediaPicker from "@/components/MediaPicker/MediaPicker";
import { useParams, useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown/Dropdown";

interface ToolData {
  name: string;
  color: string;
  slug: string;
  url: string;
  imagePath: string;
  width?: number;
  height?: number;
}

interface SlideData {
  name: string;
  color?: string;
  image: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
  };
}

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

const EditProject: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
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
    languages: [],
    tools: [],
    client: {
      location: {
        latitude: 0,
        longitude: 0
      },
      logo: {
        name: '',
        path: '',
        width: 0,
        height: 0
      },
      title: '',
      description: '',
      slides: []
    }
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();

        console.log("Data", data)
        console.log("Width", data.client.logo.width)
        console.log("Height", data.client.logo.height)


        // Transform tools data for List component
        const tools = (data.tools as ToolData[])?.map((tool: ToolData) => ({
          name: tool.name || '',
          color: tool.color || '',
          slug: tool.slug || '',
          url: tool.url || '',
          thumbnail: {
            name: tool.imagePath?.split('/').pop() || '',
            path: tool.imagePath?.replace(/[^/]*$/, '') || '',
            width: tool.width,
            height: tool.height
          }
        })) || [];

        // Transform languages data for List component
        const languages = data.languages?.map((lang: Partial<LanguageItem>) => ({
          name: lang.name || '',
          color: lang.color || '',
          percentage: lang.percentage || 0
        })) || [];

        // Transform slides data for List component
        const slides = data.client?.slides?.map((slide: SlideData) => ({
          name: slide.name || '',
          color: slide.image?.backgroundColor || '',
          thumbnail: {
            name: slide.image?.src?.split('/').pop() || '',
            path: slide.image?.src?.replace(/[^/]*$/, '') || '',
            width: slide.image?.width,
            height: slide.image?.height
          }
        })) || [];

        // Transform the data to match your form structure
        setFormData({
          name: data.name,
          slug: data.slug,
          url: data.url,
          status: data.status,
          duration: data.duration,
          startDate: data.startDate.split('T')[0],
          endDate: data.endDate?.split('T')[0] || '',
          views: data.views,
          description: data.description,
          thumbnail: {
            name: data.thumbnail?.fileName || '',
            path: data.thumbnail?.path || '',
            backgroundColor: data.thumbnail?.backgroundColor
          },
          repositories: {
            github: data.repository?.url || '',
            docker: data.container?.url || '',
            figma: ''
          },
          languages: languages,
          tools: tools,
          client: {
            title: data.client?.title?.name || '',
            description: data.client?.description || '',
            location: {
              latitude: data.client?.location?.latitude || 0,
              longitude: data.client?.location?.longitude || 0
            },
            logo: {
              name: data.client?.logo?.fileName || '',
              path: data.client?.logo?.path || '',
              width: data.client?.logo?.width,
              height: data.client?.logo?.height
            },
            slides: slides
          }
        });

        // Set thumbnail if exists
        if (data.thumbnail) {
          setThumbnail({
            name: data.thumbnail.fileName,
            path: data.thumbnail.path,
            backgroundColor: data.thumbnail.backgroundColor
          });
        }

      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project');
      }
    };

    fetchProject();
  }, [id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Projects', href: '/admin/projects' },
    { label: 'All Projects', href: '/admin/projects' },
    { label: 'Edit Project', href: '/admin/projects/edit/' + id }
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
    setFormData(prev => ({
      ...prev,
      languages: items
    }));

    // Clear validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`languages[${index}].name`];
        if (item.color) delete newErrors[`languages[${index}].color`];
        if (item.percentage) delete newErrors[`languages[${index}].percentage`];
      });
      return newErrors;
    });
  };

  const handleToolsChange = (items: ToolItem[]) => {
    setFormData(prev => ({
      ...prev,
      tools: items
    }));

    // Clear validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`tools[${index}].name`];
        if (item.color) delete newErrors[`tools[${index}].color`];
        if (item.slug) delete newErrors[`tools[${index}].slug`];
        if (item.url) delete newErrors[`tools[${index}].url`];
        if (item.thumbnail?.path) delete newErrors[`tools[${index}].thumbnail.image`];
        if (item.thumbnail?.width) delete newErrors[`tools[${index}].thumbnail.width`];
        if (item.thumbnail?.height) delete newErrors[`tools[${index}].thumbnail.height`];
      });
      return newErrors;
    });
  };

  const handleClientSlidesChange = (items: SlideItem[]) => {
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        slides: items
      }
    }));

    // Clear validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      items.forEach((item, index) => {
        if (item.name) delete newErrors[`client.slides[${index}].name`];
        if (item.color) delete newErrors[`client.slides[${index}].color`];
        if (item.thumbnail?.path) delete newErrors[`client.slides[${index}].thumbnail.image`];
        if (item.thumbnail?.width) delete newErrors[`client.slides[${index}].thumbnail.width`];
        if (item.thumbnail?.height) delete newErrors[`client.slides[${index}].thumbnail.height`];
      });
      return newErrors;
    });
  };

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
          fieldErrors[fieldName] = true;
        }
      });
      return fieldErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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

    // Validate languages
    formData.languages.forEach((lang, index) => {
      if (!lang?.name?.trim()) errors[`languages[${index}].name`] = true;
      if (!lang?.color?.trim()) errors[`languages[${index}].color`] = true;
      if (!lang?.percentage) errors[`languages[${index}].percentage`] = true;
    });

    // Validate tools
    formData.tools.forEach((tool, index) => {
      if (!tool.name) errors[`tools[${index}].name`] = true;
      if (!tool.slug) errors[`tools[${index}].slug`] = true;
      if (!tool.url) errors[`tools[${index}].url`] = true;
      if (!tool.color) errors[`tools[${index}].color`] = true;
      if (!tool.thumbnail?.path) errors[`tools[${index}].thumbnail.image`] = true;
      if (!tool.thumbnail?.width) errors[`tools[${index}].thumbnail.width`] = true;
      if (!tool.thumbnail?.height) errors[`tools[${index}].thumbnail.height`] = true;
    });

    // Validate client fields
    if (!formData.client.title.trim()) errors.clientTitle = true;
    if (!formData.client.location.latitude) errors.clientLatitude = true;
    if (!formData.client.location.longitude) errors.clientLongitude = true;
    if (!formData.client.description.trim()) errors.clientDescription = true;

    // Validate client logo
    if (!formData.client.logo.name) errors.clientImage = true;
    if (!formData.client.logo.width) errors.clientWidth = true;
    if (!formData.client.logo.height) errors.clientHeight = true;

    // Validate slides
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

      const url = id ? `/api/projects/${id}` : '/api/projects';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${id ? 'update' : 'create'} project`);
      }

      window.location.href = '/admin/projects';
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDelete = async () => {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      window.location.href = '/admin/projects';
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.actions}>
        <button
          className={styles.back}
          onClick={() => router.push('/admin/projects')}
        >
          <svg style={{ rotate: '180deg' }} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--form-back-button-icon)" stroke="none">
              <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z" />
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
        {id && (
          <button
            className={styles.delete}
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Project'}
          </button>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
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
              options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
              value={formData.status}
              onChange={(value) => {
                setFormData({ ...formData, status: value })
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

        <label className={styles.title} style={{ marginBottom: 50 }}>Languages</label>
        <div style={{ marginTop: 30, marginBottom: 60 }}>
          <List
            key={`list-${formData.languages.length}`}
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Name' },
              { id: 'color', type: 'color', placeholder: 'Enter Color' },
              { id: 'percentage', type: 'number', placeholder: 'Enter Percentage' },
            ]}
            onFieldChange={(items) => handleLanguagesChange(items as LanguageItem[])}
            columns={3}
            initialItems={formData.languages}
            fieldErrors={getListErrors('languages', formData.languages)}
          />
        </div>

        <label className={styles.title} style={{ marginBottom: 50 }}>Tools</label>
        <div style={{ marginTop: 30, marginBottom: 60 }}>
          <List
            key={`list-${formData.tools.length}`}
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Name' },
              { id: 'color', type: 'color', placeholder: 'Enter Color' },
              { id: 'thumbnail', type: 'media', label: 'Thumbnail' },
              { id: 'slug', type: 'text', placeholder: 'Enter Slug' },
              { id: 'url', type: 'text', placeholder: 'Enter URL' },
            ]}
            onFieldChange={(items) => handleToolsChange(items as ToolItem[])}
            columns={3}
            initialItems={formData.tools}
            fieldErrors={getListErrors('tools', formData.tools)}
          />
        </div>

        <label className={styles.title} style={{ marginBottom: 50 }}>Client</label>
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
              key={`media-picker-${formData.client.logo.name}`}
              style={{ height: 120 }}
              value={{
                name: formData.client.logo.name,
                path: formData.client.logo.path,
                width: Number(formData.client.logo.width) || 0,
                height: Number(formData.client.logo.height) || 0
              }}
              onChange={(media) => {
                setFormData(prev => ({
                  ...prev,
                  client: {
                    ...prev.client,
                    logo: {
                      name: media.name,
                      path: media.path,
                      width: Number(media.width) || 0,
                      height: Number(media.height) || 0
                    }
                  }
                }));
                setValidationErrors(prev => {
                  const newErrors = { ...prev };
                  if (media.path) delete newErrors.clientImage;
                  if (media.width) delete newErrors.clientWidth;
                  if (media.height) delete newErrors.clientHeight;
                  return newErrors;
                });
              }}
              invalidMedia={validationErrors.clientImage}
              invalidWidth={validationErrors.clientWidth}
              invalidHeight={validationErrors.clientHeight}
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

        <div style={{ marginTop: 30 }}>
          <List
            key={`list-${formData.client.slides.length}`}
            fields={[
              { id: 'name', type: 'text', placeholder: 'Enter Slide Name' },
              { id: 'thumbnail', type: 'media', label: 'Thumbnail' },
              { id: 'color', type: 'color', placeholder: 'Enter Background Color' },
            ]}
            onFieldChange={(items) => handleClientSlidesChange(items as SlideItem[])}
            columns={2}
            initialItems={formData.client.slides}
            fieldErrors={getListErrors('client.slides', formData.client.slides)}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProject;
