import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Slideshow.module.css";
import { Slide } from "@/lib/types";

interface SlideshowProps {
  slides: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const getTransformValue = () => {
    const offset = -currentIndex * 324; // Image width + margin
    return `translateX(${offset}px)`;
  };

  return (
    <div className={styles.slideshow}>
      <div className={styles.slides} style={{ transform: getTransformValue() }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={styles.slide}
            style={{ backgroundColor: slide.image.backgroundColor }}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
