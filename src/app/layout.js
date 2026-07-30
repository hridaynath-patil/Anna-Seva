import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'अन्न सेवा (Anna Seva) - Feed Needy, Reduce Waste',
  description: 'A platform connecting donors with surplus food to those in need, managed dynamically with tracking of cities, listings and food requests.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

