import fs from 'fs';
import path from 'path';

async function getUrls() {
  const filePath = path.join(process.cwd(), 'urls.txt');
  if (!fs.existsSync(filePath)) return [];

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  let currentProvider = 'General';
  const list = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // اگر خط با [ شروع شود و به ] ختم شود، یعنی نام پروایدر است
    if (line.startsWith('[') && line.endsWith(']')) {
      currentProvider = line.slice(1, -1);
    } else {
      // خطوط دیگر لینک یا آدرس هستند
      list.push({
        provider: currentProvider,
        url: line
      });
    }
  }

  return list;
}

export default async function Home() {
  const items = await getUrls();

  return (
    <main style={{ padding: '12px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>مدیریت لینک پروایدرها ⚡</h1>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>فایل urls.txt پیدا نشد یا خالی است.</p>
      ) : (
        items.map((item, i) => (
          <div key={i} style={{ 
            marginBottom: '10px', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '6px', 
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            direction: 'ltr'
          }}>
            {/* برچسب نام پروایدر که از داخل فایل خوانده شده */}
            <span style={{ background: '#0969da', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
              {item.provider}
            </span>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0969da', textDecoration: 'none', fontSize: '13px', wordBreak: 'break-all' }}>
              {item.url}
            </a>
          </div>
        ))
      )}
    </main>
  );
}
