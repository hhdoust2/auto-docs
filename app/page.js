import fs from 'fs';
import path from 'path';

async function getRawMarkdown() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const docs = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      docs.push({
        fileName: file,
        content: fileContents
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getRawMarkdown();

  return (
    <main style={{ 
      width: '100%', 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '16px', 
      boxSizing: 'border-box',
      fontFamily: 'monospace' 
    }}>
      <h1 style={{ 
        fontSize: '18px', 
        borderBottom: '1px solid #ccc', 
        paddingBottom: '10px',
        wordBreak: 'break-word'
      }}>
        محتوای خام فایل‌های پوشه content 📱💻
      </h1>

      {docs.length === 0 ? (
        <p style={{ marginTop: '20px' }}>هنوز فایلی در پوشه content یافت نشده است.</p>
      ) : (
        docs.map((doc, index) => (
          <div key={index} style={{ marginTop: '20px', width: '100%' }}>
            <h3 style={{ 
              background: '#eee', 
              padding: '10px', 
              margin: '0 0 8px 0',
              fontSize: '15px',
              borderRadius: '4px',
              wordBreak: 'break-word'
            }}>
              📁 {doc.fileName}
            </h3>
            <pre style={{ 
              background: '#f4f4f4', 
              padding: '12px', 
              borderRadius: '6px', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              overflowX: 'auto',
              fontSize: '13px',
              lineHeight: '1.6',
              border: '1px solid #ddd',
              margin: 0
            }}>
              {doc.content}
            </pre>
          </div>
        ))
      )}
    </main>
  );
}
