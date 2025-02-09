// app/components/RootLayout.tsx
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container">
      <NavigationBar />
      {children}
      <Footer />
    </div>
  );
}
