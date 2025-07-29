import React, { useEffect, useRef } from "react";
import styles from "./Slider.module.css";
import Slide from "@/components/Slide/Slide";

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

    // Duplicate the slides to create an infinite loop effect
    const duplicatedSlides = [...slides, ...slides];

    let start = 0;
    const slideWidth = slides[0].width; // Use the width of the first slide
    const totalWidth = slideWidth * duplicatedSlides.length;
    const animationSpeed = 1; // Adjust this to control the speed

    const animate = () => {
      start -= animationSpeed;

      // When we reach the end of the duplicated slides, reset to the beginning
      if (start <= -totalWidth / 2) {
        // Disable transitions temporarily
        slider.style.transition = "none";

        // Reset the position without a visible jump
        start = 0;
        slider.style.transform = `translateX(${start}px)`;

        // Force a reflow to apply the reset without a visible jump
        void slider.offsetWidth;

        // Re-enable transitions
        slider.style.transition = "transform 0.5s linear"; // Adjust timing as needed
      }

      // Apply the translation
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
        {slides.concat(slides).map((slide, index) => (
          <Slide
            key={index}
            name={slide.name}
            color={slide.color}
            image={slide.imagePath}
            url={slide.url}
            width={slide.width}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
