import "./globals.css";

export const metadata = {
  title: "Framely — Any link. Every size. One clean screenshot.",
  description:
    "Paste a URL and get instant screenshots in every size you need — for gig covers, portfolios, Figma, and social previews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
