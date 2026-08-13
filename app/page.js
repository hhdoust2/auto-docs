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
    <main style={{ padding: '10px', fontFamily: 'sans-serif' }}>
      {docs.map((doc, i) => (
        <details key={i} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <summary style={{ padding: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            {doc.name}
          </summary>
          {/* 
              استایل جدید:
              1. fontFamily: 'monospace' باعث می‌شود ستون‌ها دقیقا زیر هم قرار بگیرند.
              2. overflowX: 'auto' باعث اسکرول افقی در صورت بزرگ بودن جدول می‌شود.
          */}
          <div style={{ 
            padding: '10px', 
            overflowX: 'auto', 
            background: '#f8f8f8' 
          }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre', 
              fontSize: '12px', 
              fontFamily: 'monospace',
              lineHeight: '1.2'
            }}>
              {doc.content}
            </pre>
          </div>
        </details>
      ))}
    </main>
  );
}
