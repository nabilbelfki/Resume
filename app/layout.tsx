"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation"; // Use usePathname instead of useRouter
import { ReCaptchaProvider } from "next-recaptcha-v3";
import SideBar from '@/components/SideBar/SideBar'
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import LoadScriptWrapper from "../components/LoadScriptWrapper/LoadScriptWrapper"; // Adjust the import path as needed
import styles from "./Layout.module.css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const pathname = usePathname();
  const isLoginPage = pathname === "/admin";
  const isAdminPage = pathname?.substring(0,6) === "/admin" && !isLoginPage;
  const isSharePage = pathname === "/share";
  const [showFooter, setShowFooter] = useState(true);

  const containerStyles = isAdminPage ? styles[`admin-container`] : styles[`site-container`]

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

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Nabil Belfki</title>
        <meta name="author" content="Nabil Belfki" />
        <meta name="description" content="Let’s bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta name="keywords" content="software engineer, web development, mobile development, AI, ML, custom software, Nabil Belfki" />
        <meta name="author" content="Nabil Belfki" />
        <meta property="og:title" content="Nabil Belfki - Software Engineer" />
        <meta property="og:description" content="Let’s bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta property="og:image" content="/images/profile.png" />
        <meta property="og:url" content="https://nabilbelfki.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nabil Belfki - Software Engineer" />
        <meta name="twitter:description" content="Let’s bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents." />
        <meta name="twitter:image" content="/images/profile.png" />


        <link
          rel="icon"
          href="/images/favicon.ico"
          type="image/x-icon"
          sizes="16x16"
        />
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-6FW0ZXSQCR`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6FW0ZXSQCR');
          `}
        </Script>
      </head>
      <body>
        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_V3}
        >
          <LoadScriptWrapper>
            <div className={isAdminPage ? styles[`admin-container`] : styles[`site-container`]}>
              {!isLoginPage && (<NavigationBar type={isAdminPage ? 'admin' : 'classic'} />)}
              {isAdminPage && (<SideBar />)}
              {children}
              {(showFooter && !isLoginPage && !isAdminPage) && (<Footer />)}
            </div>
          </LoadScriptWrapper>
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
