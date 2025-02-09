// /app/layout.tsx
import React from "react";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
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
      </head>
      <body>
        <div className="container">
          <NavigationBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
