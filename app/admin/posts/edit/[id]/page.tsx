"use client"
import React, { useCallback, useState, useRef, useEffect } from "react";
import styles from "./Post.module.css"
import { useUser } from '@/contexts/UserContext';
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb, Block, Checkbox, Element, ListItem } from "@/lib/types";
import ThumbnailUpload from "@/components/ThumbnailUpload/ThumbnailUpload"
import Dropdown from "@/components/Dropdown/Dropdown";
import BannerUpload from "@/components/BannerUpload/BannerUpload";
import Editor from "@/components/Editor/Editor";
import Image from 'next/image';
import Table from "@/components/Table/Table";
import { EditorHandle } from "@/lib/types"
import { useParams, useRouter } from "next/navigation";

interface PostData {
  title: string;
  date: string;
  readTime: number;
  views?: number;
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

const Post: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useUser();
  const editorRef = useRef<EditorHandle>(null);
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
    readTime: 0,
    category: '',
    date: '',
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
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Posts', href: '/admin/posts' },
    { label: 'All Posts', href: '/admin/posts' },
    { label: 'Edit Post', href: '/admin/posts/edit/' + id }
  ];

  const actions = [
    {
      label: 'Delete Comments',
      action: async (commentIDs: string[]) => {
        if (!confirm(`Are you sure you want to delete ${commentIDs.length > 1 ? 'these comments' : 'this comment'}?`)) {
          return;
        }

        try {
          // Use Promise.all to delete all users in parallel
          await Promise.all(
            commentIDs.map(commentID =>
              fetch(`/api/posts/${id}/comments/${commentID}`, {
                method: 'DELETE',
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to delete comments');
                  }
                })
            )
          );

          console.log(`${commentIDs.length} comments deleted successfully`);
          router.refresh();
        } catch (err) {
          console.error('Error deleting comments:', err);
          alert(`Failed to delete some comments. Please try again.`);
        }
      }
    }
  ]

  const convertContentToBlocks = useCallback((content: Element[]): Block[] => {
    return content.map(item => {
      const textAlign = item.textAlign === 'undefined' ? undefined : item.textAlign;
      const baseBlock = {
        id: Date.now() + Math.random(),
        content: '',
        textAlign: textAlign || 'left'
      };

      if (item.tag === 'p' || ['h2', 'h3', 'h4', 'h5', 'h6'].includes(item.tag)) {
        return {
          ...baseBlock,
          type: item.tag,
          content: item.text || ''
        };
      } else if (item.tag === 'ol' || item.tag === 'ul') {
        const listItems = (item.items ?? []) as ListItem[];
        const lines = listItems.map((i) => ({
          content: i.text,
          level: i.marginLeft / 20 // Assuming 20px per level
        }));
        return {
          ...baseBlock,
          type: item.tag,
          content: JSON.stringify(lines)
        };
      } else if (item.tag === 'checkbox') {
        const checkboxItems = (item.items ?? []) as Checkbox[];
        const lines = checkboxItems.map((i) => ({
          content: i.text,
          checked: i.checked
        }));
        return {
          ...baseBlock,
          type: item.tag,
          content: JSON.stringify(lines)
        };
      } else if (item.tag === 'media') {
        // Handle media blocks
        const source = item.source ?? '';
        const lastSlashIndex = source.lastIndexOf('/');
        return {
          ...baseBlock,
          type: 'media',
          content: JSON.stringify({
            name: source.split('/').pop() || '',
            path: lastSlashIndex >= 0 ? source.substring(0, lastSlashIndex + 1) : ''
          })
        };
      } else if (item.tag === 'delimiter') {
        return {
          ...baseBlock,
          type: 'delimiter',
          content: JSON.stringify(item)
        };
      } else if (item.tag === 'table') {
        return {
          ...baseBlock,
          type: 'table',
          content: JSON.stringify(item.records || [])
        };
      } else if (item.tag === 'quote' || item.tag === 'warning') {
        return {
          ...baseBlock,
          type: item.tag,
          content: item.text || ''
        };
      } else if (item.tag === 'code') {
        return {
          ...baseBlock,
          type: 'code',
          content: item.text || ''
        };
      }

      // Default to paragraph
      return {
        ...baseBlock,
        type: 'p',
        content: ''
      };
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleThumbnailChange = useCallback((media: { name: string; path: string; backgroundColor?: string }) => {
    setThumbnail(media);
    setFormData(prev => ({
      ...prev,
      thumbnail: {
        name: media.name,
        path: media.path,
        backgroundColor: media.backgroundColor
      }
    }));
    setValidationErrors(prev => prev.thumbnail ? ({ ...prev, thumbnail: false }) : prev);
  }, []);

  const handleBannerChange = useCallback((media: { name: string; path: string; backgroundColor?: string }) => {
    setBanner(media);
    setFormData(prev => ({
      ...prev,
      banner: {
        name: media.name,
        path: media.path,
        backgroundColor: media.backgroundColor
      }
    }));
    setValidationErrors(prev => prev.banner ? ({ ...prev, banner: false }) : prev);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchMedia = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);
          if (!response.ok) throw new Error('Failed to fetch post');
          const post = await response.json();
          console.log("Post", post)

          if (post.thumbnail) {
            const thumbnailLastSlashIndex = post.thumbnail.lastIndexOf('/');
            const thumbnailPath = post.thumbnail.substring(0, thumbnailLastSlashIndex + 1);
            const thumbnailName = post.thumbnail.substring(thumbnailLastSlashIndex + 1);
            handleThumbnailChange({ name: thumbnailName, path: thumbnailPath, backgroundColor: '' })
          }

          if (post.banner) {
            const bannerLastSlashIndex = post.banner.lastIndexOf('/');
            const bannerPath = post.banner.substring(0, bannerLastSlashIndex + 1);
            const bannerName = post.banner.substring(bannerLastSlashIndex + 1);
            console.log(bannerPath, bannerName)
            handleBannerChange({ name: bannerName, path: bannerPath, backgroundColor: '' })
          }

          // console.log("Content", post.content.stringify);

          // Use functional update to ensure we have the latest state
          setFormData(prevFormData => ({
            ...prevFormData,
            title: post.title,
            readTime: post.readTime,
            category: post.category,
            date: post.date,
            status: post.status,
            visibility: post.visibility,
            content: post.content,
            slug: post.slug,
            tags: post.tags,
          }));

          // Initialize editor with content
          if (editorRef.current && post.content) {
            const blocks = convertContentToBlocks(post.content);
            editorRef.current.setBlocks(blocks);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchMedia();
    }
  }, [id, convertContentToBlocks, handleBannerChange, handleThumbnailChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form", formData)

    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.title.trim()) errors.title = true;
    if (!formData.category.trim()) errors.category = true;
    if (!formData.date.trim()) errors.date = true;
    if (!formData.visibility) errors.visibility = true;
    if (!formData.readTime) errors.readTime = true;
    if (!formData.thumbnail.name) errors.thumbnail = true;
    if (!formData.banner.name) errors.banner = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {

      const content = editorRef.current?.getContent();
      console.log("Blocks", content);
      // Ensure logo data is properly set
      const finalFormData = {
        title: formData.title,
        date: formData.date,
        readTime: formData.readTime,
        author: {
          firstName: user?.firstName,
          lastName: user?.lastName
        },
        views: 0,
        category: formData.category,
        status: "Draft",
        visibility: formData.visibility,
        content,
        thumbnail: `${formData.thumbnail.path}${formData.thumbnail.name}`,
        banner: `${formData.banner.path}${formData.banner.name}`,
        slug: formData.title.toLowerCase().replaceAll(" ", "-"),
        tags: []
      };

      console.log("Form", finalFormData);

      const response = await fetch('/api/posts/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      router.push('/admin/posts');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post');
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
          onClick={() => router.push('/admin/posts')}
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
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.title ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.category ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.readTime ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="visibility">Visibility</label>
            <Dropdown
              placeholder='Choose Visibility'
              options={[
                { label: 'Public', value: 'Public' },
                { label: 'Private', value: 'Private' }
              ]}
              value={formData.visibility}
              onChange={(value) => {
                // Optional: Allow manual override if needed
                setFormData(prev => ({
                  ...prev,
                  visibility: value as 'Public' | 'Private' | null
                }))
                if (validationErrors.visibility) {
                  setValidationErrors(prev => ({ ...prev, visibility: false }));
                }
              }}
              style={{
                button: {
                  border: validationErrors.visibility ? '1.6px solid red' : ''
                }
              }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              placeholder="Enter Date"
              value={formData.date}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.date ? '1.6px solid red' : '' }}
            />
          </div>
        </div>

        <BannerUpload
          value={banner}
          onChange={handleBannerChange}
          style={{ border: validationErrors.banner ? '1.6px solid red' : '' }}
        />

        <Editor ref={editorRef} />

        <label className={styles.title}>Comments</label>
        <Table
          link={false}
          actions={actions}
          showing={5}
          entity="Comment"
          endpoint={`posts/${id}/comments`}
          create={false}
          style={{ marginTop: 20 }}
          columns={[
            {
              label: 'Name',
              selectors: [['author', 'firstName'], ['author', 'lastName']],
              type: 'avatar',
              flex: 1
            },
            {
              label: 'Comment',
              selectors: [['text']],
              flex: 3
            },
            {
              label: 'Date',
              selectors: [['date']],
              alignment: 'center',
              sort: true,
              type: 'date'
            }
          ]}
        />
      </div>
    </div>
  );
}

export default Post;
