import fs from 'fs';
import path from 'path';

async function getDocs() {
  const contentDir = path.join(process.cwd(), 'content');
  const urlsPath = path.join(process.cwd(), 'urls.txt');
  
  if (!fs.existsSync(contentDir)) return [];

  // خواندن فایل urls.txt برای پیدا کردن نام پروایدرها
  let providerMap = {};
  if (fs.existsSync(urlsPath)) {
    const urlContent = fs.readFileSync(urlsPath, 'utf8');
    const lines = urlContent.split('\n');
    let currentProvider = 'General';

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('[') && line.endsWith(']')) {
        currentProvider = line.slice(1, -1);
      } else {
        const fileName = line.split('/').pop();
        if (fileName) {
          providerMap[fileName] = currentProvider;
        }
      }
    }
  }

  const files = fs.readdirSync(contentDir);
  return files.filter(f => f.endsWith('.md')).map(file => {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
    
    // استفاده از پروایدر خوانده شده از urls.txt، وگرنه استفاده از نام پیش‌فرض فایل
    const provider = providerMap[file] || file.split('-')[0].toUpperCase();
    const title = file.replace('.md', '').toUpperCase();

    return {
      fileName: file,
      provider: provider,
      title: title,
      content: content
    };
  });
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ padding: '10px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {docs.map((doc, i) => (
        <details key={i} style={{ marginBottom: '15px', border: '1px solid #999', borderRadius: '4px', background: '#fff' }}>
          <summary style={{ 
            padding: '10px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            background: '#eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              {/* برچسب نام پروایدر که از urls.txt خوانده شده */}
              <span style={{ background: '#0969da', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', marginRight: '8px' }}>
                {doc.provider}
              </span>
              <span>{doc.title}</span>
            </div>
            <span style={{ color: '#666', fontSize: '11px', fontWeight: 'normal' }}>({doc.fileName})</span>
          </summary>
          
          <div style={{ 
            padding: '10px', 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch', 
            background: '#fff' 
          }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre', 
              fontSize: '12px', 
              fontFamily: 'monospace',
              lineHeight: '1.4',
              display: 'inline-block' 
            }}>
              {doc.content}
            </pre>
          </div>
        </details>
      ))}
    </main>
  );
}
