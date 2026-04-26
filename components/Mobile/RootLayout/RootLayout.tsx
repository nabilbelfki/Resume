import NavigationBar from "@/components/Mobile/NavigationBar/NavigationBar";
import Footer from "@/components/Mobile/Footer/Footer";
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
