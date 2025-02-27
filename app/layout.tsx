"use client";
import React from "react";
import Script from "next/script";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import LoadScriptWrapper from "./components/LoadScriptWrapper"; // Adjust the import path as needed
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Your page description here" />
        <meta name="keywords" content="your, keywords, here" />
        <meta name="author" content="Your Name" />
        <title>Nabil Belfki</title>
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
            <div className="container">
              <NavigationBar />
              {children}
              <Footer />
            </div>
          </LoadScriptWrapper>
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
