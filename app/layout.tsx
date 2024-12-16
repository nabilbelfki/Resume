import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className='container'>
          <NavigationBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
