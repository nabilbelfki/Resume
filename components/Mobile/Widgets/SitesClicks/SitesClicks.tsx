"use client";
import React, { useState } from "react";
import styles from "./SitesClicks.module.css";
import Image from "next/image";

const sites = [
    {
        thumbnail: '/images/logos/clue-thumbnail.svg',
        name: 'Clue',
        link: 'www.clue.nabilbelfki.com',
        clicks: 35,
        backgroundColor: '#FF4B4B'
    },
    {
        thumbnail: '/images/logos/personal-thumbnail.svg',
        name: 'nabilbelfki.com',
        link: 'www.nabilbelfki.com',
        clicks: 18,
        backgroundColor: '#011A49'
    },
    {
        thumbnail: '/images/logos/supersail-thumbnail.svg',
        name: 'Supersail',
        link: 'www.supersail.nabilbelfki.com',
        clicks: 7,
        backgroundColor: '#81C1F9'
    },
    {
        thumbnail: '/images/logos/na-thumbnail.svg',
        name: 'NANJ',
        link: 'www.narcotics-anonymous.nabilbelfki.com',
        clicks: 0,
        backgroundColor: '#FFFFFF'
    }
];
type Timeframe = 'D' | 'W' | 'M' | 'Y';
const SitesClicks: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('D');
    const handleTimeframeChange = (newTimeframe: Timeframe) => {
        setTimeframe(newTimeframe);
    };

    return (<div className={styles.container}>
        <h2 className={styles.title}>Sites Clicks</h2>
        <div className={styles.timeframe}>
            <div className={timeframe === 'D' ? styles.selected : ''} onClick={()=> handleTimeframeChange('D')}>D</div>
            <div className={timeframe === 'W' ? styles.selected : ''} onClick={()=> handleTimeframeChange('W')}>W</div>
            <div className={timeframe === 'M' ? styles.selected : ''} onClick={()=> handleTimeframeChange('M')}>M</div>
            <div className={timeframe === 'Y' ? styles.selected : ''} onClick={()=> handleTimeframeChange('Y')}>Y</div>
        </div>
        <div className={styles.sites}>
            {sites.map((site, index) => 
                <div key={`site-${index}`} className={styles.site}>
                    <div className={styles.thumbnail} style={{backgroundColor: site.backgroundColor}}>
                        <Image src={site.thumbnail} alt={`${site.name} Thumbail`} height={40} width={80}/>
                    </div>
                    <div className={styles['name-and-link']}>
                        <div className={styles.name}>{site.name}</div>
                        <div className={styles.link}>{site.link}</div>
                    </div>
                    <div className={styles.clicks}>{site.clicks}</div>
                </div>
            )}
        </div>
    </div>);
};

export default SitesClicks