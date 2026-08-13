export const metadata = {
  title: 'داشبورد مستندات',
  description: 'مستندات خودکار پروایدرها',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f6f8' }}>
        {children}
      </body>
    </html>
  );
}
