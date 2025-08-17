"use client"
import React, { useState } from "react";
import styles from "./Post.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload"
import Dropdown from "@/components/Dropdown/Dropdown";
import BannerUpload from "@/components/BannerUpload/BannerUpload";
import Editor from "@/components/Editor/Editor";

interface PostData {
  title: string;
  date: string;
  readTime: number;
  views: number;
  category: string;
  status: "Draft" | "Published" | "Archived";
  visibility: "Public" | "Private" | null;
  content: string[];
  thumbnail: {
    name: string;
    path: string;
    backgroundColor?: string;
  },
  banner: {
    name: string;
    path: string;
    backgroundColor?: string;
  },
  slug: string;
  tags: string[];
}

const Project: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<{ name: string; path: string; backgroundColor?: string }>({ 
    name: '', 
    path: '' 
  });

  const [banner, setBanner] = useState<{ name: string; path: string; backgroundColor?: string }>({ 
    name: '', 
    path: '' 
  });
  
  const [formData, setFormData] = useState<PostData>({
    title: '',
    date: '',
    readTime: 0,
    views: 0,
    category: '',
    status: "Draft",
    visibility: 'Public',
    content: [],
    thumbnail: {
      name: '',
      path: '',
      backgroundColor: '',
    },
    banner: {
      name: '',
      path: '',
      backgroundColor: '',
    },
    slug: '',
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs: breadcrumb[] = [
    { label: 'Posts', href: '/admin/posts' },
    { label: 'All Posts', href: '/admin/posts' },
    { label: 'Create Post', href: '/admin/posts/create' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

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
  };

  const handleBannerChange = (media: { name: string; path: string; backgroundColor?: string }) => {
    setBanner(media);
    setFormData(prev => ({
      ...prev,
      banner: {
        name: media.name,
        path: media.path,
        backgroundColor: media.backgroundColor
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
 
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
        <button 
          className={styles.back} 
          onClick={() => window.location.href = '/admin/posts'}
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
        <div className={styles.avatarContainer}>
          <label>Thumbnail</label>
          <ThumbnailUpload 
            value={thumbnail}
            onChange={handleThumbnailChange}
          />
        </div>
        <label className={styles.title}>General Information</label>
        <div className={styles.grid}>
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
            <label htmlFor="category">Category</label>
            <input 
              type="text" 
              id="category" 
              placeholder="Enter Category" 
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="readTime">Read Time</label>
            <input 
              type="number" 
              id="readTime" 
              placeholder="Enter Read Time" 
              value={formData.readTime}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="visibility">Visibility</label>
            <Dropdown 
              placeholder='Choose Visibility' 
              options={[
                {label:'Public', value: 'Public'}, 
                {label:'Private', value: 'Private'}
              ]}
              value={formData.visibility}
              onChange={(value) => {
                // Optional: Allow manual override if needed
                setFormData(prev => ({
                  ...prev,
                  visibility: value as 'Public' | 'Private' | null
                }))
              }}
            />
          </div>
        </div>

        <BannerUpload 
          value={banner}
          onChange={handleBannerChange}
        />

        <Editor />
      </div>
    </div>
  );
}

export default Project;