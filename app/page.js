import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

async function getDocs() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const docs = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      const processedContent = await remark().use(html).process(fileContents);
      
      // ساخت نام تمیز برای پروایدر
      const providerName = file.replace('.md', '').toUpperCase().replace(/-/g, ' ');

      docs.push({
        fileName: file,
        name: providerName,
        content: processedContent.toString()
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ padding: '12px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <style>{`
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          margin: 15px 0;
          -webkit-overflow-scrolling: touch;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          background: #fff;
          white-space: nowrap;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        th { background-color: #f1f1f1; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        p { line-height: 1.6; font-size: 14px; }
      `}</style>

      <h1 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '8px' }}>مستندات خودکار پروایدرها ⚡</h1>
      
      {/* بخش نمایش فهرست پروایدرهای موجود در بالای صفحه */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '10px 14px', 
        borderRadius: '6px', 
        marginBottom: '20px',
        border: '1px solid #e1e4e8',
        fontSize: '13px'
      }}>
        <strong style={{ display: 'block', marginBottom: '6px', color: '#333' }}>پروایدرهای موجود در این داشبورد:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {docs.map((doc, i) => (
            <span key={i} style={{ 
              background: '#e1dfdd', 
              padding: '3px 8px', 
              borderRadius: '4px', 
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#222'
            }}>
              {doc.name}
            </span>
          ))}
        </div>
      </div>

      {docs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>هنوز فایلی در پوشه content نیست.</p>
      ) : (
        docs.map((doc, i) => (
          <details key={i} style={{ marginBottom: '12px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' }}>
            <summary style={{ padding: '12px', cursor: 'pointer', fontWeight: 'bold', background: '#f6f8fa', borderRadius: '6px 6px 0 0' }}>
              📁 پروایدر: {doc.name} <span style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>({doc.fileName})</span>
            </summary>
            
            <div className="table-wrapper" style={{ padding: '12px' }}>
              <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
          </details>
        ))
      )}
    </main>
  );
}
