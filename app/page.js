import fs from 'fs';
import path from 'path';

async function getDocs() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const docs = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // نام پروایدر را از روی نام فایل می‌سازیم (مثلا groq-limits.md تبدیل به Groq Limits می‌شود)
      const providerName = file
        .replace('.md', '')
        .replace(/-/g, ' ')
        .toUpperCase();

      docs.push({
        fileName: file,
        provider: providerName,
        content: fileContents
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '16px', 
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '24px',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '16px'
      }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>داشبورد مستندات پروایدرها ⚡</h1>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
          برای مشاهده اطلاعات هر پروایدر، روی آن کلیک کنید.
        </p>
      </header>

      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>هنوز فایلی در پوشه content یافت نشده است.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {docs.map((doc, index) => (
            <details 
              key={index} 
              style={{ 
                background: '#fff', 
                border: '1px solid #e1e4e8', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <summary style={{ 
                padding: '14px 16px', 
                cursor: 'pointer', 
                fontSize: '15px', 
                fontWeight: 'bold',
                background: '#f6f8fa',
                color: '#0366d6',
                userSelect: 'none',
                outline: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>📁 {doc.provider}</span>
                <span style={{ fontSize: '12px', color: '#586069', fontWeight: 'normal' }}>({doc.fileName})</span>
              </summary>

              <div style={{ padding: '16px', borderTop: '1px solid #e1e4e8', background: '#fff' }}>
                <pre style={{ 
                  background: '#f6f8fa', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  overflowX: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  border: '1px solid #e1e4e8',
                  margin: 0
                }}>
                  {doc.content}
                </pre>
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}

