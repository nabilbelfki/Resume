"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Video from '@/components/Video/Video';
import { Project } from '@/lib/types';
import styles from './ProjectsCarousel.module.css';

interface ProjectsCarouselProps {
    projects: Project[];
}

const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Group projects into chunks of 4 globally
    const chunkSize = 4;
    const chunkedProjects = [];
    for (let i = 0; i < projects.length; i += chunkSize) {
        chunkedProjects.push(projects.slice(i, i + chunkSize));
    }

    const totalChunks = chunkedProjects.length;

    // Automatic slideshow tick mapping
    useEffect(() => {
        if (totalChunks <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalChunks);
        }, 6000); // 6 seconds slide

        return () => clearInterval(interval);
    }, [totalChunks]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchStartX.current - touchEndX.current;
            const threshold = 50; 

            if (distance > threshold) {
                // Swiped Left - go Next
                setCurrentIndex((prev) => (prev + 1) % totalChunks);
            } else if (distance < -threshold) {
                // Swiped Right - go Previous
                setCurrentIndex((prev) => (prev - 1 + totalChunks) % totalChunks);
            }
        }
        // Reset 
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (!projects || projects.length === 0) return null;

    return (
        <div className={styles.carouselContainer}>
            <div 
                className={styles.carouselTrack}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: 'transform 0.5s ease-in-out'
                }}
            >
                {chunkedProjects.map((chunk, chunkIndex) => (
                    <div className={styles.carouselSlide} key={`chunk-${chunkIndex}`}>
                        <div className="projects">
                            {chunk.map((project) => (
                                <Link key={project._id} href={`/application/${project._id}`}>
                                    <Video
                                        name={project.name}
                                        videoPath={`/videos/${project.slug}.mp4`}
                                        thumbnail={project.thumbnail}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {totalChunks > 1 && (
                <div className="project-pages">
                    {chunkedProjects.map((_, dotIndex) => (
                        <div 
                            key={`dot-${dotIndex}`}
                            className={`project-page ${currentIndex === dotIndex ? 'selected-page' : ''}`}
                            onClick={() => setCurrentIndex(dotIndex)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsCarousel;
