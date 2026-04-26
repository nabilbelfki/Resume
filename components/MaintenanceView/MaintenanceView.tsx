import React from 'react';
import Image from 'next/image';
import styles from './MaintenanceView.module.css';

const MaintenanceView: React.FC = () => {
    return (
        <div className={styles.maintenanceWrapper}>
            <Image 
                src="/images/builder.png"
                alt="Nabil in a hard hat"
                width={275}
                height={275}
                className={styles.builderImage}
            />
            <h1 className={styles.title}>Under Maintenance 🛠️🔩</h1>
            <p className={styles.description}>
                Right now the site is down because something big is being built. Don't worry, it'll be back up and running soon. I would check back shortly!
            </p>
        </div>
    );
};

export default MaintenanceView;
