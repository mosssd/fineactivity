import 'bootstrap-icons/font/bootstrap-icons.css';
import { ConvexProvider } from "convex/react";

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return <Component {...pageProps} />
}

export default MyApp;