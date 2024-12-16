import React from 'react';
import Biography from './components/Biography';
import Timeline from './components/Timeline';

export default function Home() {
    return (
        <div>
            <Biography
                name="Nabil Belfki"
                role="Software Engineer"
                imagePath="/images/profile.jpg"
                imageAlt="Nabil Belfki"
                biography="There is nothing that I can’t do or accomplish. I’m a great asset to a team and company. I’ve transformed countless clients in my career by helping them automate processes and solve their problems. I’m code agnostic haven write projects in many different stacks. I have knowledge in many different sectors from the flight industry to banking and finance to e-commerce."
            />
            <div className='experience-and-skills'>
                <Timeline />
            </div>
        </div>
    );
}
