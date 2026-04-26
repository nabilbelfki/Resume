import React from "react";
import styles from "./LatestMedia.module.css";
import Image from "next/image";

const medias = [
  {
    source: '/images/magic-the-gathering.jpg',
    description: 'Photo of Magic the Gathering logo'
  },
  {
    source: '/images/littlest-pet-shop.jpg',
    description: 'Photo of Littlest Pet Shop logo'
  },
  {
    source: '/images/my-little-pony.png',
    description: 'Photo of My Little Pony logo'
  },
  {
    source: '/images/nerf.jpeg',
    description: 'Photo of NERF logo'
  },
  {
    source: '/images/transformers.png',
    description: 'Photo of Transformers logo'
  },
  {
    source: '/images/playdoh.png',
    description: 'Photo of PlayDoh logo'
  },
  {
    source: '/images/cluedo.png',
    description: 'Photo of Clue logo'
  },
  {
    source: '/images/ship.png',
    description: 'Photo of Ship drawing I drew'
  },
  {
    source: '/images/coin.png',
    description: 'Photo of Coin drawing I drew'
  }
];

const LatestMedia: React.FC = () => {
    return (<div className={styles.container}>
        <h2 className={styles.title}>Latest Media</h2>
        <div className={styles.medias}>
          {medias.map((media, index) => 
            <div key={`media-${index}`} className={styles.media}>
              <Image src={media.source} alt={media.description} height={200} width={200}/>
            </div>
          )}
        </div>
    </div>);
};

export default LatestMedia;
