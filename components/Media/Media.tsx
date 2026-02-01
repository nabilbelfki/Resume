"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Media.module.css";
import { Media as media, MediaType } from "@/lib/types"; // Import your type
import { formatFileSize, inferMediaTypeFromExtension } from "@/lib/utilities";

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
  type?: MediaType;
  isOpen: boolean;
  close: () => void;
  onSelect: (media: media) => void;  // Use the Media interface
}

interface UploadFormData {
  file: File | null;
  baseFileName: string;
  extension: string;
  description: string;
  size: number | null;
  type: 'Image' | 'Video' | 'Sound';
}

const Media: React.FC<MediaProps> = ({ type = null, isOpen, close, onSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadFormData, setUploadFormData] = useState<UploadFormData>({
    file: null,
    baseFileName: '',
    extension: '',
    description: '',
    size: null,
    type: 'Image'
  });

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
  
  const fetchImagePaths = useCallback(async (): Promise<{path: string, fileName: string, fileType: string, fileSize: number, description: string, created: string}[]> => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error instanceof Error ? error.message : 'Failed to load images');
      return [];
    }
  }, []);

  const loadInitialItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const imageData = await fetchImagePaths();

      const items = imageData.slice(0, 7).map((item, index) => ({
        id: `item-${index}`,
        fileName: item.fileName,
        fileType: item.fileType,
        fileSize: formatFileSize(item.fileSize),
        uploadedDate: new Date(item.created).toLocaleDateString(),
        description: item.description,
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
  }, [fetchImagePaths]);

  const loadMoreItems = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const imageData = await fetchImagePaths();
      const startIndex = mediaItems.length;
      const newItems = imageData.slice(startIndex, startIndex + 9).map((item, index) => ({
        id: `item-${startIndex + index}`,
        fileName: item.fileName,
        fileType: item.fileType,
        fileSize: formatFileSize(item.fileSize),
        uploadedDate: new Date(item.created).toLocaleDateString(),
        description: item.description,
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

  const handleRemoveImage = () => {
    setUploadFormData({
      file: null,
      baseFileName: '',
      extension: '',
      description: '',
      size: null,
      type: 'Image'
    })
    setIsUploading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const lastDotIndex = file.name.lastIndexOf('.');
      const baseFileName = lastDotIndex === -1 ? file.name : file.name.slice(0, lastDotIndex);
      const extension = lastDotIndex === -1 ? '' : file.name.slice(lastDotIndex + 1);
      const size = file.size;
      const type = inferMediaTypeFromExtension(extension);

      setUploadFormData({
        file,
        baseFileName,
        extension,
        description: '',
        size,
        type
      });
      setIsUploading(true);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFormData(prev => ({ ...prev, baseFileName: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUploadFormData(prev => ({ ...prev, description: e.target.value }));
  };

    const uploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!uploadFormData.file) {
        throw new Error('Please select a file to upload');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', uploadFormData.file);
      formDataToSend.append('type', uploadFormData.type);
      formDataToSend.append('description', uploadFormData.description);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      await response.json();
      // Refresh the list after a successful upload
      setIsUploading(false);
      loadInitialItems();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  useEffect(() => {
    loadInitialItems();
  }, [loadInitialItems, type]);

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
              {isUploading ? (<div className={styles.uploading}>
                <button 
                    className={styles.remove} 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent clicks
                        handleRemoveImage();
                    }}
                    aria-label="Remove avatar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 5 5" fill="none">
                        <path d="M2.5 0C3.88071 0 5 1.11929 5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0ZM3.4541 1.33301C3.37607 1.25531 3.2499 1.25531 3.17188 1.33301L2.5 2.00488L1.82812 1.33301C1.75015 1.25536 1.62394 1.25546 1.5459 1.33301L1.33301 1.5459C1.25531 1.62393 1.25531 1.7501 1.33301 1.82812L2.00488 2.5L1.33301 3.17188C1.25498 3.24999 1.25493 3.377 1.33301 3.45508L1.54492 3.66699C1.623 3.74507 1.75001 3.74502 1.82812 3.66699L2.5 2.99512L3.17188 3.66699C3.24999 3.74502 3.377 3.74507 3.45508 3.66699L3.66699 3.45508C3.74507 3.377 3.74502 3.24999 3.66699 3.17188L2.99512 2.5L3.66699 1.82812C3.74464 1.75015 3.74454 1.62394 3.66699 1.5459L3.4541 1.33301Z" fill="#979797ff"/>
                    </svg>
                </button>
                {uploadFormData.file && uploadFormData.type === 'Image' && (
                  <Image
                    src={URL.createObjectURL(uploadFormData.file)}
                    alt="upload preview"
                    width={200}
                    height={200}
                    unoptimized
                  />
                )}
                {uploadFormData.file && uploadFormData.type === 'Video' && (
                  <video src={URL.createObjectURL(uploadFormData.file)} controls />
                )}
                {uploadFormData.file && uploadFormData.type === 'Sound' && (
                  <span className={styles.audioIcon}>🔊</span>
                )}
                {!uploadFormData.file && (
                  <span>No file selected</span>
                )}
              </div>) : (
                <button className={styles.new} onClick={handleUploadClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="62" viewBox="0 0 22 22" fill="none">
                    <rect x="10" width="2" height="22" rx="0.5" fill="#B3B3B3"/>
                    <rect x="22" y="10" width="2" height="22" rx="0.5" transform="rotate(90 22 10)" fill="#B3B3B3"/>
                  </svg>
                  <span>UPLOAD MEDIA</span>
                  <input 
                    ref={uploadFileRef} 
                    type="file" 
                    accept={type === 'Image' ? 'image/*' : 
                            (type === 'Video' ? 'video/*' : 
                            (type === 'Sound' ? 'audio/*' :
                            '*/*'))}
                    onChange={handleFileChange}
                    hidden
                  />
                </button>
              )}
              
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
                      {item.fileType === 'Image' && (
                        <div className={styles.imageContainer}>
                            <Image 
                            src={item.url} 
                            alt={item.description} 
                            fill
                            style={{
                                objectFit: 'contain'
                            }}
                            />
                        </div>
                      )}
                      {item.fileType === 'Video' && (
                        <video src={item.url} controls={false} />
                      )}
                      {item.fileType === 'Sound' && (
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
          {isUploading ? (
            <form className={styles['upload']} onSubmit={uploadMedia}>
              {selectedMedia ? (
                <>
                  <div className={styles.information}>
                    <div className={styles.field}>
                      <span className={styles.label}>File Name:</span>
                      <input 
                        type="text"
                        value={uploadFormData.baseFileName}
                        onChange={handleFileNameChange}  
                      />
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>File Type:</span>
                      <span className={styles.value}>{uploadFormData.type}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>File Size:</span>
                      <span className={styles.value}>{formatFileSize(uploadFormData.size || 0)}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>Uploaded:</span>
                      <span className={styles.value}>{new Date().toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>Description:</span>
                      <textarea
                        className={styles.description}
                        value={uploadFormData.description}
                        onChange={handleDescriptionChange}
                      />
                    </div>
                  </div>
                  <button className={styles.save}>
                    Upload Media
                  </button>
                </>
              ) : (
                <div className={styles.noSelection}>
                  {error ? 'Error loading media' : 'Select a media file to view details'}
                </div>
              )}
            </form>
          ) : (
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
          )}
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Media;
