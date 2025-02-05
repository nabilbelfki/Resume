import React from "react";
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
  return (
    <div className={styles.slider}>
      {slides.map((slide, index) => (
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
  );
};

export default Slider;
