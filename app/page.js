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
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        محتوای خام فایل‌های پوشه content 📄
      </h1>

      {docs.length === 0 ? (
        <p style={{ marginTop: '20px' }}>هنوز فایلی در پوشه content یافت نشده است.</p>
      ) : (
        docs.map((doc, index) => (
          <div key={index} style={{ marginTop: '30px' }}>
            <h3 style={{ background: '#eee', padding: '8px', margin: '0 0 10px 0' }}>
              📁 {doc.fileName}
            </h3>
            <pre style={{ 
              background: '#f4f4f4', 
              padding: '15px', 
              borderRadius: '5px', 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word',
              fontSize: '14px',
              border: '1px solid #ddd'
            }}>
              {doc.content}
            </pre>
          </div>
        ))
      )}
    </main>
  );
}
