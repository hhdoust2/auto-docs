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
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '12px', 
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#222'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        padding: '12px 0',
        borderBottom: '1px solid #ddd'
      }}>
        <h1 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>داشبورد مستندات ⚡</h1>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          برای مشاهده اطلاعات، روی هر گزینه لمس کنید.
        </p>
      </header>

      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', background: '#fff', borderRadius: '8px' }}>
          <p style={{ fontSize: '13px', color: '#666' }}>هنوز فایلی یافت نشده است.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {docs.map((doc, index) => (
            <details 
              key={index} 
              style={{ 
                background: '#fff', 
                border: '1px solid #d0d7de', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <summary style={{ 
                padding: '12px 14px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: 'bold',
                background: '#f6f8fa',
                color: '#0969da',
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                wordBreak: 'break-all'
              }}>
                <span>📁 {doc.provider}</span>
                <span style={{ fontSize: '11px', color: '#8c959f', fontWeight: 'normal', marginLeft: '6px' }}>چیزیـ</span>
              </summary>

              <div style={{ padding: '10px', borderTop: '1px solid #d0d7de', background: '#ffffff', overflowX: 'auto' }}>
                <pre style={{ 
                  background: '#f6f8fa', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  border: '1px solid #eaeef2',
                  margin: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box'
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
