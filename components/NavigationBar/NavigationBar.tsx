"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setIsMaintenance(!!data?.data?.siteMaintenance);
        }
      } catch (e) {
        console.error("Navigation failed identifying global maintenance locks.", e);
      }
    };
    fetchSettings();
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    const handleSectionFocused = (event: any) => {
      const { id, className } = event.detail;
      
      // Determine if we are on the first slide
      const isFirstSlide = id === "biography";
      
      // Determine if we are on the last slide
      const isLastSlide = className.includes("contact-and-schedule-meeting");

      setIsScrolled(!isFirstSlide);
      setIsAtBottom(isLastSlide);
    };

    window.addEventListener("section-focused", handleSectionFocused);
    return () => {
      window.removeEventListener("section-focused", handleSectionFocused);
    };
  }, [pathname]);

  const isHero = !isScrolled && type === 'classic' && pathname === '/' && !isMaintenance;
  const shouldHide = isScrolled && !isAtBottom && type === 'classic' && pathname === '/';

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
    <nav className={`${type === 'classic' ? styles.nav : styles['nav-admin']} ${isHero ? styles.heroNav : styles.boxShadow} ${shouldHide ? styles.hidden : ""}`}>
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
                <span>{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</span>
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
        (<>
          {isHero ? (
            <Link href="/" className={styles.heroLogo}>
              <svg height="35" viewBox="0 0 40 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.88386e-05 10.0801V7.77245e-05H2.78605L7.26605 8.90408L6.58005 9.07208V7.77245e-05H8.68005V10.0801H5.89405L1.41405 1.17608L2.10005 1.00808V10.0801H4.88386e-05ZM9.71222 10.0801L13.3242 7.77245e-05H15.1722L11.8542 10.0801H9.71222ZM17.1042 10.0801L13.8002 7.77245e-05H15.7322L19.3442 10.0801H17.1042ZM11.6162 6.17408H17.2722V7.85408H11.6162V6.17408ZM21.9711 10.0801V8.54008H24.5751C25.0417 8.54008 25.3917 8.41408 25.6251 8.16208C25.8677 7.90074 25.9891 7.54141 25.9891 7.08408C25.9891 6.61741 25.8584 6.24874 25.5971 5.97808C25.3451 5.70741 24.9811 5.57208 24.5051 5.57208H21.9711V4.03208H24.3931C24.8317 4.03208 25.1631 3.92941 25.3871 3.72408C25.6204 3.50941 25.7371 3.19674 25.7371 2.78608C25.7371 2.37541 25.6251 2.06741 25.4011 1.86208C25.1864 1.64741 24.8644 1.54008 24.4351 1.54008H21.9711V7.77245e-05H24.8971C25.7931 7.77245e-05 26.5164 0.228745 27.0671 0.686078C27.6177 1.14341 27.8931 1.76408 27.8931 2.54808C27.8931 3.04274 27.7764 3.46741 27.5431 3.82208C27.3097 4.17674 26.9971 4.44741 26.6051 4.63408C26.2131 4.82074 25.7744 4.91408 25.2891 4.91408L25.3591 4.62008C25.8817 4.62008 26.3531 4.73208 26.7731 4.95608C27.2024 5.18008 27.5431 5.49741 27.7951 5.90808C28.0471 6.30941 28.1731 6.78541 28.1731 7.33608C28.1731 7.88674 28.0424 8.37208 27.7811 8.79208C27.5291 9.20274 27.1697 9.52008 26.7031 9.74408C26.2457 9.96808 25.7044 10.0801 25.0791 10.0801H21.9711ZM20.2071 10.0801V7.77245e-05H22.3631V10.0801H20.2071ZM29.2989 10.0801V7.77245e-05H31.4549V10.0801H29.2989ZM32.8536 10.0801V7.77245e-05H35.0096V10.0801H32.8536ZM33.8616 10.0801V8.42808H39.8536V10.0801H33.8616Z" fill="url(#paint0_linear_1557_4563)" />
                <defs>
                  <linearGradient id="paint0_linear_1557_4563" x1="-1.14429" y1="-0.919922" x2="40.8557" y2="11.0801" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#D8D8D8" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          ) : (
            <Link href="/">
              <svg height="35" viewBox="0 0 40 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-0.000195302 10.0801V7.77245e-05H2.7858L7.2658 8.90408L6.57981 9.07208V7.77245e-05H8.6798V10.0801H5.8938L1.4138 1.17608L2.0998 1.00808V10.0801H-0.000195302ZM9.71198 10.0801L13.324 7.77245e-05H15.172L11.854 10.0801H9.71198ZM17.104 10.0801L13.8 7.77245e-05H15.732L19.344 10.0801H17.104ZM11.616 6.17408H17.272V7.85408H11.616V6.17408ZM21.9708 10.0801V8.54008H24.5748C25.0415 8.54008 25.3915 8.41408 25.6248 8.16208C25.8675 7.90074 25.9888 7.54141 25.9888 7.08408C25.9888 6.61741 25.8582 6.24874 25.5968 5.97808C25.3448 5.70741 24.9808 5.57208 24.5048 5.57208H21.9708V4.03208H24.3928C24.8315 4.03208 25.1628 3.92941 25.3868 3.72408C25.6202 3.50941 25.7368 3.19674 25.7368 2.78608C25.7368 2.37541 25.6248 2.06741 25.4008 1.86208C25.1862 1.64741 24.8642 1.54008 24.4348 1.54008H21.9708V7.77245e-05H24.8968C25.7928 7.77245e-05 26.5162 0.228745 27.0668 0.686078C27.6175 1.14341 27.8928 1.76408 27.8928 2.54808C27.8928 3.04274 27.7762 3.46741 27.5428 3.82208C27.3095 4.17674 26.9968 4.44741 26.6048 4.63408C26.2128 4.82074 25.7742 4.91408 25.2888 4.91408L25.3588 4.62008C25.8815 4.62008 26.3528 4.73208 26.7728 4.95608C27.2022 5.18008 27.5428 5.49741 27.7948 5.90808C28.0468 6.30941 28.1728 6.78541 28.1728 7.33608C28.1728 7.88674 28.0422 8.37208 27.7808 8.79208C27.5288 9.20274 27.1695 9.52008 26.7028 9.74408C26.2455 9.96808 25.7042 10.0801 25.0788 10.0801H21.9708ZM20.2068 10.0801V7.77245e-05H22.3628V10.0801H20.2068ZM29.2986 10.0801V7.77245e-05H31.4546V10.0801H29.2986ZM32.8533 10.0801V7.77245e-05H35.0093V10.0801H32.8533ZM33.8613 10.0801V8.42808H39.8533V10.0801H33.8613Z" fill="url(#paint0_linear_1558_4622)" />
                <defs>
                  <linearGradient id="paint0_linear_1558_4622" x1="-1.14453" y1="-1.28199" x2="41.3912" y2="10.6412" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#636363" />
                    <stop offset="1" stopColor="#1F1F1F" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          )}
          <ul className={isHero ? styles.heroList : ""}>
            <NavigationLink href="/" label="Portfolio" isHero={isHero} />
            <NavigationLink href="/resume" label="Resume" isHero={isHero} />
            <NavigationLink href="/blog" label="Blog" isHero={isHero} />
            <NavigationLink href="/contact" label="Contact" isHero={isHero} />
          </ul>
        </>
        )}
    </nav>
  );
};

export default NavigationBar;
