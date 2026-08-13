import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

async function getDocsWithProviders() {
  const contentDir = path.join(process.cwd(), 'content');
  const urlsPath = path.join(process.cwd(), 'urls.txt');
  
  // ۱. خواندن فایل‌های پروژه‌ی خودتان از پوشه content
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);

  // ۲. خواندن فایل urls.txt برای فهمیدن اینکه هر فایل متعلق به چه پروایدری است
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
        // استخراج نام فایل از انتهای لینک یا مسیر
        const fileName = line.split('/').pop();
        if (fileName) {
          providerMap[fileName] = currentProvider;
        }
      }
    }
  }

  const docs = [];
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      const processedContent = await remark().use(html).process(fileContents);
      
      // تشخیص پروایدر از روی urls.txt یا نام پیش‌فرض فایل
      const provider = providerMap[file] || file.split('-')[0].toUpperCase();
      const title = file.replace('.md', '').toUpperCase();

      docs.push({
        fileName: file,
        provider: provider,
        title: title,
        content: processedContent.toString()
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocsWithProviders();

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
          direction: ltr;
        }
        th { background-color: #f1f1f1; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        p { line-height: 1.6; font-size: 14px; }
      `}</style>

      <h1 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>مستندات پروایدرها ⚡</h1>

      {docs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>هنوز فایلی در پوشه content نیست یا تنظیم نشده است.</p>
      ) : (
        docs.map((doc, i) => (
          <details key={i} style={{ marginBottom: '15px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' }}>
            <summary style={{ 
              padding: '12px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              background: '#f6f8fa', 
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                {/* برچسب پروایدر (خوانده شده از urls.txt یا خودکار) */}
                <span style={{ background: '#0969da', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', marginRight: '8px' }}>
                  {doc.provider}
                </span>
                <span>{doc.title}</span>
              </div>
              <span style={{ color: '#666', fontSize: '11px', fontWeight: 'normal' }}>({doc.fileName})</span>
            </summary>
            
            {/* نمایش جدولِ مارک‌داونِ خودتان با اسکرول افقی استاندارد در موبایل */}
            <div className="table-wrapper" style={{ padding: '12px' }}>
              <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
          </details>
        ))
      )}
    </main>
  );
}
