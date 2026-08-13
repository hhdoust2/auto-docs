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
      
      docs.push({
        fileName: file,
        provider: file.replace('.md', '').toUpperCase().replace(/-/g, ' '),
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
      padding: '10px', 
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      direction: 'ltr'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px' }}>Documentation Dashboard ⚡</h1>
      </header>

      {docs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No documents found in content folder.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {docs.map((doc, index) => (
            <details key={index} style={{ 
              background: '#fff', border: '1px solid #ccc', borderRadius: '6px' 
            }}>
              <summary style={{ padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                {doc.provider}
              </summary>
              <div style={{ padding: '10px', background: '#f9f9f9', overflowX: 'auto' }}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-all', 
                  fontSize: '12px',
                  textAlign: 'left'
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
