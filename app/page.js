import fs from 'fs';
import path from 'path';

async function getDocs() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  return files.filter(f => f.endsWith('.md')).map(file => {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
    return {
      name: file.replace('.md', '').toUpperCase(),
      content: content
    };
  });
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ padding: '10px' }}>
      {docs.map((doc, i) => (
        <details key={i} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <summary style={{ padding: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            {doc.name}
          </summary>
          <div style={{ padding: '10px', overflowX: 'auto' }}>
            {/* 
               whiteSpace: 'pre' یعنی دقیقا عین فایل اصلی نمایش بده (بدون شکستن خطوط)
               overflowX: 'auto' یعنی اگر جدول از صفحه موبایل بیرون زد، خودش اسکرول افقی بده
            */}
            <pre style={{ margin: 0, whiteSpace: 'pre', fontSize: '12px' }}>
              {doc.content}
            </pre>
          </div>
        </details>
      ))}
    </main>
  );
}
