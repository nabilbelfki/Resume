"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationLink from "@/components/NavigationBar/NavigationLink/NavigationLink";
import styles from "./NavigationBar.module.css";
import { useUser } from '@/contexts/UserContext';
import { stringToHexColor, isColorTooDark } from '@/lib/color';
import { signOut } from "next-auth/react";


interface NavigationBarProps {
  type?: 'classic' | 'admin';
}

const NavigationBar: React.FC<NavigationBarProps> = ({ type = 'classic' }) => {
  console.log("Navigation Type: ", type)
  const { user } = useUser();

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };

    if (dropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown]);

  const signout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/admin' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setDropdown(false); // Close the dropdown
    }
  }

  if (type === "admin" && !user) return null;

  return (
    <nav className={type === 'classic' ? styles.nav : styles['nav-admin']}>
      {type === 'admin' && user ? (<>
        <Link href="/">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 16 16" fill="none">
            <rect width="15.168" height="15.168" rx="2" fill="#011A49" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4.53135 10.3163H2.57764L5.65622 4.85773H7.20735L7.2784 6.83512H7.34944L8.47431 4.86957H11.4345C12.879 4.83405 13.2106 6.7996 11.1621 7.54557C12.4173 7.8179 12.062 9.98475 9.82415 10.2926H5.78647L5.71542 8.30337H5.65622L4.53135 10.3163ZM10.3096 7.00094H9.36236L9.93072 5.99448H10.4517C10.9609 5.98264 11.3161 6.65755 10.3096 7.00094ZM9.49261 9.04938H8.20197L8.87689 7.86531H9.85967C10.4162 7.85347 10.4991 8.81256 9.49261 9.04938Z" fill="white" />
          </svg>
        </Link>
        <div className={styles['search-and-avatar']}>
          <div className={styles.search}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 7 7" fill="none">
                <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="#BDBDBD" />
              </svg>
            </div>
            <input type="text" placeholder="" />
          </div>
          <div className={styles.avatar} ref={dropdownRef}>
            <div className={styles['avatar-background']} style={{ backgroundColor: stringToHexColor(`${user.firstName} ${user.lastName}`), color: isColorTooDark(stringToHexColor(`${user.firstName} ${user.lastName}`)) ? '#FFFFFF' : '#4C4C4C' }} onClick={() => setDropdown(!dropdown)}>
              {user.image ? (
                <Image src={user.image} alt='A profile picture of the user' height={50} width={50} />
              ) : (
                <span>{`${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`}</span>
              )}
            </div>
            {dropdown && (
              <div className={styles.dropdown}>
                <button onClick={() => { location.href = '/admin/users/edit/' + user.id }}>Account</button>
                <button onClick={() => { location.href = '/admin/settings' }}>Settings</button>
                <button onClick={signout}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </>
      ) :
        (<ul>
          <NavigationLink href="/#biography" label="Biography" />
          <NavigationLink href="/#experiences" label="Experience" />
          <NavigationLink href="/#skills" label="Skills" />
          <NavigationLink href="/#projects" label="Projects" />
          <NavigationLink href="/#contact" label="Contact" />
        </ul>)}
    </nav>
  );
};

export default NavigationBar;
