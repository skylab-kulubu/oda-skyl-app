import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;


export const metadata = {
  title: "Oda SKY LAB",
  description: "odayildizskylab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </head>
    <body>{children}</body>
  </html>
  );
}
