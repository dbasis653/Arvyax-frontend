import './globals.css';
import { UserProvider } from '@/context/UserContext';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Arvyax',
  description: 'AI-Assisted Journal System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="root-body">
        <UserProvider>
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
