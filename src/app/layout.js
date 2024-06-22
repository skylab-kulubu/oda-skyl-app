import "./globals.css";

export const metadata = {
  title: "Oda SKY LAB",
  description: "odayildizskylab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
