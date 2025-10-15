import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A simple app with navigation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
