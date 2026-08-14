import fs from 'fs';
import path from 'path';

async function getDocsFromUrls() {
  const urlsPath = path.join(process.cwd(), 'urls.txt');
  if (!fs.existsSync(urlsPath)) return [];

  const fileContent = fs.readFileSync(urlsPath, 'utf8');
  const lines = fileContent.split('\n');

  let currentProvider = 'General';
  let items = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // اگر خط با [ شروع شود، نام پروایدر است
    if (line.startsWith('[') && line.endsWith(']')) {
      currentProvider = line.slice(1, -1);
    } else {
      // خط دیگر لینک است
      items.push({
        provider: currentProvider,
        url: line
      });
    }
  }

  // گرفتن محتوای فایل‌ها از طریق لینک
  const docs = [];
  for (let item of items) {
    try {
      // تبدیل لینک‌های گیت‌هاب معمولی به لینک خام (Raw) اگر لازم باشد
      let fetchUrl = item.url;
      if (fetchUrl.includes('github.com') && !fetchUrl.includes('raw.githubusercontent.com')) {
        fetchUrl = fetchUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }

      const res = await fetch(fetchUrl);
      const content = res.ok ? await res.text() : 'خطا در بارگذاری محتوا از لینک';
      
      const fileName = item.url.split('/').pop() || 'doc.md';

      docs.push({
        provider: item.provider,
        title: fileName.replace('.md', '').toUpperCase(),
        fileName: fileName,
        content: content
      });
    } catch (e) {
      docs.push({
        provider: item.provider,
        title: 'ERROR',
        fileName: item.url,
        content: 'امکان دریافت اطلاعات وجود ندارد.'
      });
    }
  }

  return docs;
}

export default async function Home() {
  const docs = await getDocsFromUrls();

  return (
    <main style={{ padding: '10px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {docs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>فایل urls.txt پیدا نشد یا خالی است.</p>
      ) : (
        docs.map((doc, i) => (
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
        ))
      )}
    </main>
  );
}
