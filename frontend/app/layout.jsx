import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ZawajLink | Matrimonial Broker Management Portal",
  description: "Secure bilingual SaaS portal for matrimonial brokers in Qatar and the GCC"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
