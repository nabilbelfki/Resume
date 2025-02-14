import React, { useEffect, useRef } from "react";
import styles from "./Slider.module.css";
import Slide from "./Slide";

interface Slide {
  name: string;
  color: string;
  imagePath: string;
  url: string;
  width: number;
}

interface SliderProps {
  slides: Slide[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let start = 0;
    const slideWidth = slides[0].width; // Use the width of the first slide
    const totalWidth = slideWidth * slides.length;
    const animationSpeed = 2; // Adjust this to control the speed

    const animate = () => {
      start -= animationSpeed;
      if (start <= -slideWidth) {
        start += slideWidth;
        slider.appendChild(slider.firstElementChild as Node);
      }
      slider.style.transform = `translateX(${start}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [slides]);

  return (
    <div className={styles.container}>
      <div className={styles.slider} ref={sliderRef}>
        {slides.map((slide, index) => (
          <div className={styles.slide} key={index}>
            <Slide
              name={slide.name}
              color={slide.color}
              image={slide.imagePath}
              url={slide.url}
              width={slide.width}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
