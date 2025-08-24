import React, { useState } from "react";
import Image from "next/image";
import styles from "./MediaPicker.module.css"
import { Media as MediaType } from "@/lib/types";
import Media from "@/components/Media/Media";


// MediaPicker.tsx
interface MediaPickerProps {
  invalidHeight: boolean;
  invalidWidth: boolean;
  invalidMedia: boolean;
  value?: {
    name: string;
    path: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
  };
  onChange?: (media: { 
    name: string; 
    path: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
  }) => void;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ 
  value, 
  onChange,
  backgroundColor,
  style,
  invalidHeight,
  invalidWidth,
  invalidMedia
}) => {
    const [dimensions, setDimensions] = useState({
        width: value?.width || 0,
        height: value?.height || 0
    });
    
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const handleDimensionChange = (type: 'width' | 'height', val: number) => {
        const newDimensions = {
            ...dimensions,
            [type]: val
        };
        setDimensions(newDimensions);
        
        if (onChange && value) {
            onChange({
                ...value,
                ...newDimensions
            });
        }
    };


    const handleMediaSelect = (selectedMedia: MediaType) => {
        if (onChange) {
            onChange({
                name: selectedMedia.name,
                path: selectedMedia.path,
                backgroundColor: selectedMedia.backgroundColor || '',
                ...dimensions
            });
        }
        setShowMediaPicker(false);
    };

        const handleRemoveImage = () => {
        if (onChange) {
            onChange({name: '', path: ''});
        }
    };

    // Determine the background color to use
    const thumbnailBgColor = backgroundColor || value?.backgroundColor || 'var(--form-media-picker-background)';

    const widthBorderStyle = {
        borderTop: invalidWidth ? '1.6px solid red' : '',
        borderLeft: !invalidMedia && invalidWidth ? '1.6px solid red' : '',
        borderRight: invalidWidth ? '1.6px solid red' : '',
        borderBottom: invalidWidth ? '1.6px solid red' : '',
    }
    
    const heightBorderStyle = {
        borderTop: !invalidWidth && invalidHeight ? '1.6px solid red' : '',
        borderLeft: !invalidMedia && invalidHeight ? '1.6px solid red' : '',
        borderRight: invalidHeight ? '1.6px solid red' : '',
        borderBottom: invalidHeight ? '1.6px solid red' : '',
    }


    return (
        <div className={styles.container} style={style}>
            <Media 
                type="Image" 
                isOpen={showMediaPicker} 
                close={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
            />
            <div 
                className={styles.thumbnail} 
                style={{ backgroundColor: thumbnailBgColor, border: invalidMedia ? 'solid 1.6px red' : '' }}
                onClick={()=>setShowMediaPicker(true)}
            >
                {value?.name ? 
                (
                <>
                    <Image 
                        src={`${value.path}${value.name}`} 
                        alt="Skill thumbnail" 
                        width={200} 
                        height={200} 
                        style={{ 
                            objectFit: 'contain',
                            backgroundColor: thumbnailBgColor 
                        }}
                    />
                    <button 
                        className={styles.remove} 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent clicks
                            handleRemoveImage();
                        }}
                        aria-label="Remove avatar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 18 17" fill="none">
                            <g filter="url(#filter0_d_1210_14463)">
                            <mask id="path-1-inside-1_1210_14463" fill="white">
                            <path d="M6.18216 5.31838C7.93952 3.56103 10.7881 3.56102 12.5454 5.31838C14.3027 7.07574 14.3027 9.92433 12.5454 11.6817C10.7881 13.439 7.93952 13.4389 6.18216 11.6817C4.4248 9.9243 4.4248 7.07574 6.18216 5.31838ZM10.9898 6.59084C10.8726 6.47378 10.6831 6.47374 10.5659 6.59084L9.3638 7.79299L8.16165 6.59084C8.04455 6.47375 7.85499 6.47387 7.73782 6.59084L7.45462 6.87404C7.33763 6.99121 7.33752 7.18077 7.45462 7.29787L8.65676 8.50002L7.45462 9.70217C7.33752 9.8193 7.33756 10.0088 7.45462 10.126L7.73782 10.4092C7.85499 10.5261 8.04458 10.5262 8.16165 10.4092L9.3638 9.20705L10.5659 10.4092C10.6831 10.5262 10.8726 10.5262 10.9898 10.4092L11.273 10.126C11.3899 10.0089 11.39 9.81927 11.273 9.70217L10.0708 8.50002L11.273 7.29787C11.39 7.1808 11.3899 6.99121 11.273 6.87404L10.9898 6.59084Z"/>
                            </mask>
                            <path d="M6.18216 5.31838C7.93952 3.56103 10.7881 3.56102 12.5454 5.31838C14.3027 7.07574 14.3027 9.92433 12.5454 11.6817C10.7881 13.439 7.93952 13.4389 6.18216 11.6817C4.4248 9.9243 4.4248 7.07574 6.18216 5.31838ZM10.9898 6.59084C10.8726 6.47378 10.6831 6.47374 10.5659 6.59084L9.3638 7.79299L8.16165 6.59084C8.04455 6.47375 7.85499 6.47387 7.73782 6.59084L7.45462 6.87404C7.33763 6.99121 7.33752 7.18077 7.45462 7.29787L8.65676 8.50002L7.45462 9.70217C7.33752 9.8193 7.33756 10.0088 7.45462 10.126L7.73782 10.4092C7.85499 10.5261 8.04458 10.5262 8.16165 10.4092L9.3638 9.20705L10.5659 10.4092C10.6831 10.5262 10.8726 10.5262 10.9898 10.4092L11.273 10.126C11.3899 10.0089 11.39 9.81927 11.273 9.70217L10.0708 8.50002L11.273 7.29787C11.39 7.1808 11.3899 6.99121 11.273 6.87404L10.9898 6.59084Z" fill="white"/>
                            <path d="M6.18216 5.31838L6.11144 5.24767L6.11144 5.24767L6.18216 5.31838ZM12.5454 5.31838L12.6161 5.24767L12.6161 5.24767L12.5454 5.31838ZM12.5454 11.6817L12.6161 11.7524L12.6161 11.7524L12.5454 11.6817ZM6.18216 11.6817L6.11144 11.7524L6.11145 11.7524L6.18216 11.6817ZM10.9898 6.59084L11.0605 6.52013L11.0605 6.5201L10.9898 6.59084ZM10.5659 6.59084L10.4952 6.52012L10.4952 6.52013L10.5659 6.59084ZM9.3638 7.79299L9.29309 7.8637L9.3638 7.93441L9.43451 7.8637L9.3638 7.79299ZM7.73782 6.59084L7.66717 6.52007L7.66711 6.52013L7.73782 6.59084ZM7.45462 6.87404L7.38391 6.80333L7.38385 6.80339L7.45462 6.87404ZM8.65676 8.50002L8.72748 8.57073L8.79819 8.50002L8.72748 8.42931L8.65676 8.50002ZM7.45462 9.70217L7.38391 9.63146L7.38389 9.63147L7.45462 9.70217ZM7.45462 10.126L7.38388 10.1967L7.38391 10.1967L7.45462 10.126ZM7.73782 10.4092L7.66711 10.4799L7.6672 10.48L7.73782 10.4092ZM8.16165 10.4092L8.23235 10.4799L8.23236 10.4799L8.16165 10.4092ZM9.3638 9.20705L9.43451 9.13634L9.3638 9.06563L9.29309 9.13634L9.3638 9.20705ZM10.5659 10.4092L10.4952 10.4799L10.4953 10.4799L10.5659 10.4092ZM10.9898 10.4092L11.0604 10.48L11.0605 10.4799L10.9898 10.4092ZM11.273 10.126L11.3437 10.1967L11.3437 10.1966L11.273 10.126ZM11.273 9.70217L11.3437 9.63149L11.3437 9.63146L11.273 9.70217ZM10.0708 8.50002L10.0001 8.42931L9.92941 8.50002L10.0001 8.57073L10.0708 8.50002ZM11.273 7.29787L11.3437 7.36858L11.3437 7.36857L11.273 7.29787ZM11.273 6.87404L11.3438 6.80342L11.3437 6.80333L11.273 6.87404ZM6.18216 5.31838L6.25287 5.38909C7.97117 3.6708 10.7564 3.67079 12.4747 5.38909L12.5454 5.31838L12.6161 5.24767C10.8197 3.45126 7.90786 3.45127 6.11144 5.24767L6.18216 5.31838ZM12.5454 5.31838L12.4747 5.38909C14.1929 7.1074 14.193 9.89267 12.4747 11.6109L12.5454 11.6817L12.6161 11.7524C14.4125 9.95599 14.4125 7.04408 12.6161 5.24767L12.5454 5.31838ZM12.5454 11.6817L12.4747 11.6109C10.7565 13.3292 7.97118 13.3292 6.25286 11.6109L6.18216 11.6817L6.11145 11.7524C7.90786 13.5487 10.8198 13.5488 12.6161 11.7524L12.5454 11.6817ZM6.18216 11.6817L6.25287 11.6109C4.53456 9.89264 4.53456 7.1074 6.25287 5.38909L6.18216 5.31838L6.11144 5.24767C4.31503 7.04408 4.31503 9.95596 6.11144 11.7524L6.18216 11.6817ZM10.9898 6.59084L11.0605 6.5201C10.9043 6.36405 10.6514 6.36395 10.4952 6.52012L10.5659 6.59084L10.6366 6.66156C10.7147 6.58352 10.841 6.58351 10.9191 6.66158L10.9898 6.59084ZM10.5659 6.59084L10.4952 6.52013L9.29309 7.72228L9.3638 7.79299L9.43451 7.8637L10.6367 6.66155L10.5659 6.59084ZM9.3638 7.79299L9.43451 7.72228L8.23236 6.52013L8.16165 6.59084L8.09094 6.66155L9.29309 7.8637L9.3638 7.79299ZM8.16165 6.59084L8.23236 6.52013C8.07615 6.36392 7.82332 6.36419 7.66717 6.52007L7.73782 6.59084L7.80847 6.66161C7.88666 6.58355 8.01296 6.58357 8.09094 6.66155L8.16165 6.59084ZM7.73782 6.59084L7.66711 6.52013L7.38391 6.80333L7.45462 6.87404L7.52533 6.94475L7.80853 6.66155L7.73782 6.59084ZM7.45462 6.87404L7.38385 6.80339C7.22794 6.95954 7.2277 7.21237 7.38391 7.36858L7.45462 7.29787L7.52533 7.22716C7.44733 7.14917 7.44732 7.02288 7.52538 6.9447L7.45462 6.87404ZM7.45462 7.29787L7.38391 7.36858L8.58605 8.57073L8.65676 8.50002L8.72748 8.42931L7.52533 7.22716L7.45462 7.29787ZM8.65676 8.50002L8.58605 8.42931L7.38391 9.63146L7.45462 9.70217L7.52533 9.77288L8.72748 8.57073L8.65676 8.50002ZM7.45462 9.70217L7.38389 9.63147C7.22775 9.78767 7.22782 10.0405 7.38388 10.1967L7.45462 10.126L7.52536 10.0553C7.4473 9.97719 7.4473 9.85093 7.52534 9.77287L7.45462 9.70217ZM7.45462 10.126L7.38391 10.1967L7.66711 10.4799L7.73782 10.4092L7.80853 10.3385L7.52533 10.0553L7.45462 10.126ZM7.73782 10.4092L7.6672 10.48C7.82332 10.6357 8.07615 10.6361 8.23235 10.4799L8.16165 10.4092L8.09095 10.3385C8.01301 10.4164 7.88665 10.4164 7.80844 10.3384L7.73782 10.4092ZM8.16165 10.4092L8.23236 10.4799L9.43451 9.27776L9.3638 9.20705L9.29309 9.13634L8.09094 10.3385L8.16165 10.4092ZM9.3638 9.20705L9.29309 9.27776L10.4952 10.4799L10.5659 10.4092L10.6367 10.3385L9.43451 9.13634L9.3638 9.20705ZM10.5659 10.4092L10.4953 10.4799C10.6514 10.636 10.9043 10.6359 11.0604 10.48L10.9898 10.4092L10.9191 10.3384C10.841 10.4164 10.7147 10.4164 10.6366 10.3385L10.5659 10.4092ZM10.9898 10.4092L11.0605 10.4799L11.3437 10.1967L11.273 10.126L11.2023 10.0553L10.9191 10.3385L10.9898 10.4092ZM11.273 10.126L11.3437 10.1966C11.4996 10.0405 11.4998 9.78767 11.3437 9.63149L11.273 9.70217L11.2022 9.77285C11.2802 9.85087 11.2802 9.97721 11.2022 10.0553L11.273 10.126ZM11.273 9.70217L11.3437 9.63146L10.1415 8.42931L10.0708 8.50002L10.0001 8.57073L11.2023 9.77288L11.273 9.70217ZM10.0708 8.50002L10.1415 8.57073L11.3437 7.36858L11.273 7.29787L11.2023 7.22716L10.0001 8.42931L10.0708 8.50002ZM11.273 7.29787L11.3437 7.36857C11.4999 7.21237 11.4995 6.95954 11.3438 6.80342L11.273 6.87404L11.2022 6.94466C11.2802 7.02288 11.2802 7.14923 11.2023 7.22717L11.273 7.29787ZM11.273 6.87404L11.3437 6.80333L11.0605 6.52013L10.9898 6.59084L10.9191 6.66155L11.2023 6.94475L11.273 6.87404Z" fill="#727272" mask="url(#path-1-inside-1_1210_14463)"/>
                            </g>
                            <defs>
                            <filter id="filter0_d_1210_14463" x="0.864136" y="0.000366211" width="16.9993" height="16.9993" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1210_14463"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1210_14463" result="shape"/>
                            </filter>
                            </defs>
                        </svg>
                    </button>
                </>
                ) : (<div className={styles.unselected}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 7 6" fill="none">
                        <path d="M1.37896 2.26823L0.226004 3.45809C0.135623 3.55137 0.085083 3.67615 0.085083 3.80604V5.49998C0.085083 5.77612 0.308941 5.99998 0.585083 5.99998H5.58508C5.86123 5.99998 6.08508 5.77612 6.08508 5.49998V4.83701C6.08508 4.70368 6.03183 4.57586 5.93715 4.48198L4.90938 3.4628C4.74165 3.29647 4.48041 3.27021 4.28294 3.39983L3.77833 3.73106C3.5571 3.87627 3.26103 3.82396 3.10296 3.61172L2.13904 2.31751C1.95499 2.07039 1.59338 2.04694 1.37896 2.26823Z" fill="#727272"/>
                        <rect x="0.335083" y="0.25" width="5.5" height="5.5" rx="0.55" stroke="#727272" strokeWidth="0.5"/>
                        <circle cx="4.23888" cy="1.84612" r="0.461538" fill="#727272"/>
                    </svg>
                </div>)}
            </div>
            <div className={styles['width-and-height']}>
                <div className={styles.width} style={widthBorderStyle}>
                    <input 
                        type="number" 
                        placeholder="W" 
                        value={dimensions.width || ''}
                        onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                    />
                </div>
                <div className={styles.height} style={heightBorderStyle}>
                    <input 
                        type="number" 
                        placeholder="H" 
                        value={dimensions.height || ''}
                        onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};  

export default MediaPicker;