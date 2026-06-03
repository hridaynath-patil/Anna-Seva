import PublicHeader from '@/components/PublicHeader';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <footer className="public-footer">
        <p>© {new Date().getFullYear()} Anna Seva. All rights reserved. Connecting Donors & Feeding the Needy.</p>
      </footer>
    </>
  );
}
