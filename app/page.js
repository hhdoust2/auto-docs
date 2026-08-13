import fs from 'fs';
import path from 'path';

async function getDocs() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
}

export default async function Home() {
  const files = await getDocs();
  // آدرس اصلی ریپازیتوری شما در گیت‌هاب
  const GITHUB_REPO = "https://github.com/hhdoust2/auto-docs/blob/main/content";

  return (
    <main style={{ padding: '10px' }}>
      <h1 style={{ fontSize: '18px', textAlign: 'center' }}>مستندات گیت‌هاب ⚡</h1>
      {files.map((file, i) => (
        <details key={i} style={{ marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <summary style={{ padding: '12px', cursor: 'pointer', fontWeight: 'bold', background: '#f4f4f4' }}>
            {file.toUpperCase()}
          </summary>
          {/* Iframe محتوا را مستقیماً از گیت‌هاب می‌کشد و تمام مشکلات نمایش را حل می‌کند */}
          <iframe 
            src={`https://github.com/hhdoust2/auto-docs/blob/main/content/${file}?plain=1`} 
            style={{ width: '100%', height: '500px', border: 'none', marginTop: '10px' }}
            title={file}
          />
        </details>
      ))}
    </main>
  );
}
