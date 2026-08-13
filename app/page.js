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
        <details key={i} style={{ marginBottom: '15px', border: '1px solid #999', borderRadius: '4px' }}>
          <summary style={{ padding: '10px', cursor: 'pointer', fontWeight: 'bold', background: '#eee' }}>
            {doc.name}
          </summary>
          
          {/* 
            این بخش تضمین می‌کند که اسکرول بار ظاهر شود:
            1. display: block و overflow-x: auto برای فعال کردن نوار اسکرول در موبایل
            2. whiteSpace: 'pre' برای اینکه جدول‌های متنی به هم نریزند
            3. min-width برای اینکه مرورگر مجبور شود نوار اسکرول را نشان دهد
          */}
          <div style={{ 
            padding: '10px', 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch', // برای نرم‌تر شدن اسکرول در موبایل
            background: '#fff' 
          }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre', 
              fontSize: '12px', 
              fontFamily: 'monospace',
              lineHeight: '1.4',
              display: 'inline-block' // باعث می‌شود عرض pre دقیقا به اندازه جدول باشد
            }}>
              {doc.content}
            </pre>
          </div>
        </details>
      ))}
    </main>
  );
}
