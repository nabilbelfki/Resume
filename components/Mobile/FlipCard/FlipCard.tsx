"use client"
import React, { useState } from 'react';

// Define the props for the FlipCard component
interface FlipCardProps {
  frontContent: React.ReactNode; // Content to display on the front side
  backContent: React.ReactNode;  // Content to display on the back side
  initialFlip?: boolean;         // Optional: if true, the card starts flipped
}

// The FlipCard functional component
const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent, initialFlip = false }) => {
  // State to manage whether the card is flipped or not
  const [isFlipped, setIsFlipped] = useState(initialFlip);

  // Function to toggle the flipped state
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    // The main container for the flip card.
    // 'relative' is needed for positioning child elements.
    // 'w-64 h-80' sets a fixed size for the card.
    // 'cursor-pointer' indicates it's clickable.
    // 'style={{ perspective: '1000px' }}' is crucial for the 3D effect.
    // It defines the depth of the 3D space for the transformation.
    <div
      className="relative w-64 h-80 cursor-pointer rounded-lg overflow-hidden"
      style={{ perspective: '1000px' }}
      onClick={handleFlip} // Attach the click handler to flip the card
    >
      {/* The inner container that will actually perform the 3D rotation */}
      {/* 'absolute w-full h-full' makes it cover the parent container. */}
      {/* 'transition-transform duration-700 ease-in-out' defines the animation properties. */}
      {/* 'style={{ transformStyle: 'preserve-3d' }}' ensures child elements are positioned in 3D space. */}
      {/* 'transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'' applies the rotation based on state. */}
      <div
        className={`absolute w-full h-full transition-transform duration-700 ease-in-out`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Side of the Card */}
        {/* 'absolute w-full h-full' positions it to cover the inner container. */}
        {/* 'bg-blue-500 rounded-lg shadow-lg' provides basic styling. */}
        {/* 'flex items-center justify-center' centers the content. */}
        {/* 'backfaceVisibility: 'hidden'' hides the back of the element when rotated away from the viewer. */}
        <div
          className="absolute w-full h-full bg-blue-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xl font-bold p-4"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}
        </div>

        {/* Back Side of the Card */}
        {/* Similar styling to the front, but with an initial 180deg rotation. */}
        {/* This makes it appear as the "back" when the inner container is not flipped (0deg). */}
        <div
          className="absolute w-full h-full bg-green-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xl font-bold p-4"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;