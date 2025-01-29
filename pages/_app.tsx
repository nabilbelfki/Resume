// pages/_app.tsx
import "../app/globals.css"; // Adjust the path if necessary
import type { AppProps } from "next/app";
import RootLayout from "../app/components/RootLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
