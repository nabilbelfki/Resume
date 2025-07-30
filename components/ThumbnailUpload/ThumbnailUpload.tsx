import React, { useState } from "react";
import Image from "next/image";
import styles from "./ThumbnailUpload.module.css"
import { Media as media } from "@/lib/types";
import Media from "@/components/Media/Media";

const ThumbnailUpload: React.FC = () => {
    const select: media = {
        name: 'js.png',
        path: '/images/logos/',
        description: 'This is my description',
        type: 'Image'
    }
    
    const [media, setMedia] = useState<media | null>(select);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const handleMediaPickerClick = () => {
        setShowMediaPicker(true);
    }

    const handleMediaSelect = (selectedMedia: media) => {
        setMedia({
            name: selectedMedia.name,
            path: selectedMedia.path,
            description: selectedMedia.description,
            type: selectedMedia.type
        });
        setShowMediaPicker(false);
    }

    return (
        <div className={styles.container}>
            <Media 
                type="Image" 
                isOpen={showMediaPicker} 
                close={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
            />
            <div className={styles.thumbnail}>
                {media ? 
                (<Image src={`${media.path}${media.name}`} alt={media.description} width={200} height={200} />) : (<svg xmlns="http://www.w3.org/2000/svg" height="80" viewBox="0 0 7 6" fill="none">
                    <path d="M1.37896 2.26823L0.226004 3.45809C0.135623 3.55137 0.085083 3.67615 0.085083 3.80604V5.49998C0.085083 5.77612 0.308941 5.99998 0.585083 5.99998H5.58508C5.86123 5.99998 6.08508 5.77612 6.08508 5.49998V4.83701C6.08508 4.70368 6.03183 4.57586 5.93715 4.48198L4.90938 3.4628C4.74165 3.29647 4.48041 3.27021 4.28294 3.39983L3.77833 3.73106C3.5571 3.87627 3.26103 3.82396 3.10296 3.61172L2.13904 2.31751C1.95499 2.07039 1.59338 2.04694 1.37896 2.26823Z" fill="#727272"/>
                    <rect x="0.335083" y="0.25" width="5.5" height="5.5" rx="0.55" stroke="#727272" strokeWidth="0.5"/>
                    <circle cx="4.23888" cy="1.84612" r="0.461538" fill="#727272"/>
                </svg>)}
            </div>
            <button className={styles.edit} onClick={handleMediaPickerClick}>Edit</button>
        </div>
    );
};  

export default ThumbnailUpload;