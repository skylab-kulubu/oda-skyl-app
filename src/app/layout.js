import "./globals.css";

export const metadata = {
  title: "Oda Yıldızskylab",
  description: "odayildizskylab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
