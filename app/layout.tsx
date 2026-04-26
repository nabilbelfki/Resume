"use client";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google';
import { usePathname } from "next/navigation";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import SideBar from '@/components/SideBar/SideBar'
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import MobileNavigationBar from "@/components/Mobile/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import MobileFooter from "@/components/Mobile/Footer/Footer";
import LoadScriptWrapper from "../components/LoadScriptWrapper/LoadScriptWrapper";
import MaintenanceView from "@/components/MaintenanceView/MaintenanceView";
import styles from "./Layout.module.css";
import { UserProvider } from '@/contexts/UserContext';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin";
  const isAdminPage = pathname?.substring(0, 6) === "/admin" && !isLoginPage;
  const isSharePage = pathname === "/share";
  const [showFooter, setShowFooter] = useState(true);
  const [appearance, setAppearance] = useState('dark-mode'); // default fallback
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const fetchAppearance = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.appearance) {
            setAppearance(data.data.appearance);
          }
          if (data?.data?.siteMaintenance !== undefined) {
            setIsMaintenance(data.data.siteMaintenance);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings layout", err);
      }
    };

    fetchAppearance();

    window.addEventListener('settings-updated', fetchAppearance);
    return () => window.removeEventListener('settings-updated', fetchAppearance);
  }, []);

  const isSystemDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
  const darkModeEnabled = appearance === 'dark-mode' ? true : (appearance === 'light-mode' ? false : isSystemDark);
  const background = (isAdminPage || isLoginPage) ? (darkModeEnabled ? '#2D2D2D' : '#FFFFFF') : '#FFFFFF';
  const darkMode = darkModeEnabled;

  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 640;
      const screenWidth = window.innerWidth;
      setShowFooter(!(screenWidth <= mobileWidth && isSharePage));
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSharePage]);

  const effectiveDarkMode = (isAdminPage || isLoginPage) && darkMode;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Nabil Belfki</title>
        <meta name="author" content="Nabil Belfki" />
        <meta name="description" content="Let's bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta name="keywords" content="software engineer, web development, mobile development, AI, ML, custom software, Nabil Belfki" />
        <meta name="author" content="Nabil Belfki" />
        <meta property="og:title" content="Nabil Belfki - Software Engineer" />
        <meta property="og:description" content="Let's bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta property="og:image" content="/images/profile.png" />
        <meta property="og:url" content="https://nabilbelfki.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nabil Belfki - Software Engineer" />
        <meta name="twitter:description" content="Let's bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta name="twitter:image" content="/images/profile.png" />

        <link
          rel="icon"
          href="/images/favicon.ico"
          type="image/x-icon"
          sizes="16x16"
        />
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </head>
      <body style={{ background }} className={effectiveDarkMode ? 'dark-mode' : ''}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <UserProvider>
          <ReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_V3}
          >
            <LoadScriptWrapper>
              <DndProvider backend={HTML5Backend}>
                <div className={isAdminPage ? styles[`admin-container`] : (isLoginPage ? styles['login-container'] : styles[`site-container`])}>
                  {!isLoginPage && (
                    <>
                      <div className="desktop-only">
                        <NavigationBar type={isAdminPage ? 'admin' : 'classic'} />
                      </div>
                      {!isAdminPage && (
                        <div className="mobile-only">
                          <MobileNavigationBar type="classic" />
                        </div>
                      )}
                      {isAdminPage && (
                        <div className="mobile-only">
                          <NavigationBar type="admin" />
                        </div>
                      )}
                    </>
                  )}
                  {isAdminPage && (<SideBar />)}

                  {isMaintenance && !isAdminPage && !isLoginPage ? (
                    <MaintenanceView />
                  ) : (
                    children
                  )}

                  {(showFooter && !isLoginPage && !isAdminPage) && (
                    <>
                      <div className="desktop-only">
                        <Footer />
                      </div>
                      <div className="mobile-only">
                        <MobileFooter />
                      </div>
                    </>
                  )}
                </div>
              </DndProvider>
            </LoadScriptWrapper>
          </ReCaptchaProvider>
        </UserProvider>
      </body>
    </html>
  );
}
