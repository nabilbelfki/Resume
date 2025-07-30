"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Media.module.css";
import { Media as media, MediaType } from "@/lib/types"; // Import your type

interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
  description: string;
  url: string;
}

interface MediaProps {
  type: MediaType;
  isOpen: boolean;
  close: () => void;
  onSelect: (media: media) => void;  // Use the Media interface
}

const Media: React.FC<MediaProps> = ({ type, isOpen, close, onSelect }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        close(); // Make sure this is called
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]); // Make sure close is in the dependency array

  // Add escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

   const handleSelectMedia = () => {
    if (selectedMedia) {
      // Extract path without filename
      const path = selectedMedia.url.substring(0, selectedMedia.url.lastIndexOf('/') + 1);
      
      onSelect({
        name: selectedMedia.fileName,
        path: path,
        description: selectedMedia.description,
        type: selectedMedia.fileType as MediaType
      });
    }
  };
  
  const fetchImagePaths = async (): Promise<{path: string, name: string}[]> => {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error instanceof Error ? error.message : 'Failed to load images');
      return [];
    }
  };

  const loadInitialItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const imageData = await fetchImagePaths();
      
      const items = imageData.slice(0, 7).map((item, index) => ({
        id: `item-${index}`,
        fileName: item.name,
        fileType: type,
        fileSize: 'N/A',
        uploadedDate: new Date().toLocaleDateString(),
        description: `Image ${item.name}`,
        url: item.path.startsWith('/') ? item.path : `/${item.path}`,
      }));
      
      setMediaItems(items);
      setHasMore(imageData.length > items.length);
      if (items.length > 0) {
        setSelectedMedia(items[0]);
      } else {
        setError('No images found in the /images directory');
      }
    } catch (error) {
      console.error('Error loading initial items:', error);
      setError(error instanceof Error ? error.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const imageData = await fetchImagePaths();
      const startIndex = mediaItems.length;
      const newItems = imageData.slice(startIndex, startIndex + 9).map((item, index) => ({
        id: `item-${startIndex + index}`,
        fileName: item.name,
        fileType: type,
        fileSize: 'N/A',
        uploadedDate: new Date().toLocaleDateString(),
        description: `Image ${item.name}`,
        url: item.path.startsWith('/') ? item.path : `/${item.path}`,
      }));

      setMediaItems(prev => [...prev, ...newItems]);
      setHasMore(imageData.length > startIndex + newItems.length);
    } catch (error) {
      console.error('Error loading more items:', error);
      setError(error instanceof Error ? error.message : 'Failed to load more items');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!mediaContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = mediaContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom && !loading && hasMore) {
      loadMoreItems();
    }
  };

  const handleUploadClick = () => {
    uploadFileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      alert(`File ${files[0].name} selected for upload`);
    }
  };

  useEffect(() => {
    loadInitialItems();
  }, [type]);

  return (
    <>
    {isOpen && (<div className={styles.container} onClick={close}>
      <div className={styles.popup} ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <div className={styles['title-and-search']}>
            <h2 className={styles.title}>Media Picker</h2>
            <div className={styles.search}>
                <input type="text" />
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 7 7" fill="none">
                        <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="#BDBDBD"/>
                    </svg>
                </div>
            </div>
        </div>
        <div className={styles['medias-information-and-save']}>
          <div className={styles.medias}>
            <div 
              className={styles['media-container']} 
              ref={mediaContainerRef}
              onScroll={handleScroll}
            >
              <button className={styles.new} onClick={handleUploadClick}>
                <svg xmlns="http://www.w3.org/2000/svg" height="62" viewBox="0 0 22 22" fill="none">
                  <rect x="10" width="2" height="22" rx="0.5" fill="#B3B3B3"/>
                  <rect x="22" y="10" width="2" height="22" rx="0.5" transform="rotate(90 22 10)" fill="#B3B3B3"/>
                </svg>
                <span>UPLOAD MEDIA</span>
                <input 
                  ref={uploadFileRef} 
                  type="file" 
                  accept={type === 'Image' ? 'image/*' : type === 'Video' ? 'video/*' : 'audio/*'} 
                  onChange={handleFileChange}
                  hidden
                />
              </button>
              
              {error ? (
                <div className={styles.error}>
                  {error}
                </div>
              ) : (
                <>
                  {mediaItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`${styles.media} ${selectedMedia?.id === item.id ? styles.selected : ''}`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      {type === 'Image' && (
                        <div className={styles.imageContainer}>
                            <Image 
                            src={item.url} 
                            alt={item.fileName} 
                            fill
                            style={{
                                objectFit: 'contain'
                            }}
                            />
                        </div>
                      )}
                      {type === 'Video' && (
                        <video src={item.url} controls={false} />
                      )}
                      {type === 'Sound' && (
                        <div className={styles.audio}>
                          <span>🔊</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className={styles.loading}>
                      Loading more media...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className={styles['information-and-save']}>
            {selectedMedia ? (
              <>
                <div className={styles.information}>
                  <div className={styles.field}>
                    <span className={styles.label}>File Name:</span>
                    <span className={styles.value}>{selectedMedia.fileName}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>File Type:</span>
                    <span className={styles.value}>{selectedMedia.fileType}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>File Size:</span>
                    <span className={styles.value}>{selectedMedia.fileSize}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Uploaded:</span>
                    <span className={styles.value}>{selectedMedia.uploadedDate}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Description:</span>
                    <span className={styles.description}>{selectedMedia.description}</span>
                  </div>
                </div>
                <button className={styles.save} onClick={handleSelectMedia}>
                  Select Media
                </button>
              </>
            ) : (
              <div className={styles.noSelection}>
                {error ? 'Error loading media' : 'Select a media file to view details'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Media;