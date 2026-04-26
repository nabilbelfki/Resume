import React from "react";
import styles from "./ActiveUsers.module.css";
import Image from "next/image";
import { stringToHexColor } from '@/lib/color';

const users = [
  {
    firstName: 'Nabil',
    lastName: 'Belfki',
    image: '/images/profile.png',
    status: 'Active'
  },
  {
    firstName: 'Zak',
    lastName: 'Belfki',
    image: '/images/profile.png',
    status: 'Away'
  },
  {
    firstName: 'Ismail',
    lastName: 'Aboudihaj',
    image: '/images/profile.png',
    status: 'Inactive'
  }
];

type statusKey = 'Active' | 'Away' | 'Inactive';

const ActiveUsers: React.FC = () => {
    const statuses = {
      Active: 'green-circle',
      Away: 'yellow-circle',
      Inactive: 'red-circle',
    };

    return (<div className={styles.container}>
        <h2 className={styles.title}>Active Users</h2>
        <div className={styles.search}>
            <input type="text" placeholder="Search" />
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 7 7" fill="none">
                <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="#BDBDBD"/>
              </svg>
            </div>
        </div>
        <div className={styles.users}>
          {users.map((user, index) => {
            const name = `${user.firstName} ${user.lastName}`;
            const backgroundColor = stringToHexColor(name);
            return (
              <div key={`user-${index}`} className={styles.user}>
                <div className={styles.avatar} style={{backgroundColor}}>
                  <Image src={user.image} alt={`A profile image of ${name}`} height={30} width={30} />
                  <div className={styles[statuses[user.status as statusKey]]}></div>
                </div>
                <div className={styles.name}>{name}</div>
              </div>
            )
          })}
        </div>
    </div>);
};

export default ActiveUsers;