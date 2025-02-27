"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Video.module.css";
import { Thumbnail } from "./types";

interface VideoProps {
  name: string;
  videoPath: string;
  thumbnail: Thumbnail;
  thumbnailHeight?: number;
}

const Video: React.FC<VideoProps> = ({
  name,
  videoPath,
  thumbnail,
  thumbnailHeight,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const height = thumbnailHeight ? thumbnailHeight : 285;
  useEffect(() => {
    const setVolume = () => {
      if (videoRef.current) {
        videoRef.current.volume = 0.5; // Set volume to 50%
      }
    };

    const timeoutId = setTimeout(setVolume, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={styles.video}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && <div className={styles.preview}>{name}</div>}
      {!isHovered ? (
        <div
          className={styles.thumbnail}
          style={{ backgroundColor: thumbnail.backgroundColor, height: height }}
        >
          <Image
            src={`${thumbnail.path}${thumbnail.fileName}`}
            alt="Project Thumbnail"
            width={thumbnail.width}
            height={thumbnail.height}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          className={styles.video}
          style={{
            borderRadius: 10,
            backgroundColor:
              thumbnail.backgroundColor == "#011A49"
                ? "#092d6e"
                : thumbnail.backgroundColor,
          }}
          autoPlay
          loop
        >
          <source src={videoPath} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
export default Video;
