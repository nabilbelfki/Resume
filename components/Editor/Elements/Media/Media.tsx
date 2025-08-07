import React, { useState } from "react";
import styles from "./Media.module.css";
import MediaPicker from "@/components/Media/Media";
import { Media as MediaType } from "@/lib/types";
import Image from "next/image";


interface MediaProps {
  value?: {
    name: string;
    path: string;
    backgroundColor?: string;
  };
  onChange?: (media: { 
    name: string; 
    path: string;
    backgroundColor?: string;
  }) => void;
  backgroundColor?: string;
  onDelete: () => void;
}

const Media = React.forwardRef<HTMLParagraphElement, MediaProps>(({
  value, 
  onChange,
  backgroundColor,
  onDelete
}, ref) => {

    const [showMediaPicker, setShowMediaPicker] = useState(false);
    
    const handleMediaSelect = (selectedMedia: MediaType) => {
        if (onChange) {
            onChange({
                name: selectedMedia.name,
                path: selectedMedia.path,
                backgroundColor: selectedMedia.backgroundColor || '' // Pass background color
            });
        }
        setShowMediaPicker(false);
    };
    
    return (
        <div className={styles.container} ref={ref} >
            <MediaPicker
                isOpen={showMediaPicker} 
                close={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
            />
            <div className={styles.media} onClick={() => setShowMediaPicker(true)}>
                {value?.name ? 
                    (
                        <Image 
                            src={`${value.path}${value.name}`} 
                            alt="Skill thumbnail" 
                            width={300} 
                            height={300} 
                            style={{ 
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <div className={styles['no-media']}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="80" viewBox="0 0 7 6" fill="none">
                                <path d="M1.37896 2.26823L0.226004 3.45809C0.135623 3.55137 0.085083 3.67615 0.085083 3.80604V5.49998C0.085083 5.77612 0.308941 5.99998 0.585083 5.99998H5.58508C5.86123 5.99998 6.08508 5.77612 6.08508 5.49998V4.83701C6.08508 4.70368 6.03183 4.57586 5.93715 4.48198L4.90938 3.4628C4.74165 3.29647 4.48041 3.27021 4.28294 3.39983L3.77833 3.73106C3.5571 3.87627 3.26103 3.82396 3.10296 3.61172L2.13904 2.31751C1.95499 2.07039 1.59338 2.04694 1.37896 2.26823Z" fill="#727272"/>
                                <rect x="0.335083" y="0.25" width="5.5" height="5.5" rx="0.55" stroke="#727272" strokeWidth="0.5"/>
                                <circle cx="4.23888" cy="1.84612" r="0.461538" fill="#727272"/>
                            </svg>
                        </div>
                    )}
            </div>
            <button 
                className={styles.remove} 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                aria-label="Remove avatar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 5 5" fill="none">
                    <path d="M2.5 0C3.88071 0 5 1.11929 5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0ZM3.4541 1.33301C3.37607 1.25531 3.2499 1.25531 3.17188 1.33301L2.5 2.00488L1.82812 1.33301C1.75015 1.25536 1.62394 1.25546 1.5459 1.33301L1.33301 1.5459C1.25531 1.62393 1.25531 1.7501 1.33301 1.82812L2.00488 2.5L1.33301 3.17188C1.25498 3.24999 1.25493 3.377 1.33301 3.45508L1.54492 3.66699C1.623 3.74507 1.75001 3.74502 1.82812 3.66699L2.5 2.99512L3.17188 3.66699C3.24999 3.74502 3.377 3.74507 3.45508 3.66699L3.66699 3.45508C3.74507 3.377 3.74502 3.24999 3.66699 3.17188L2.99512 2.5L3.66699 1.82812C3.74464 1.75015 3.74454 1.62394 3.66699 1.5459L3.4541 1.33301Z" fill="#EAEAEA"/>
                </svg>
            </button>
        </div>
    );
});

export default Media;