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
      // تبدیل به HTML برای نمایش جدول‌ها
      const processedContent = await remark().use(html).process(fileContents);
      
      docs.push({
        provider: file.replace('.md', '').toUpperCase().replace(/-/g, ' '),
        content: processedContent.toString()
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '10px', boxSizing: 'border-box', fontFamily: 'sans-serif', direction: 'ltr' }}>
      <style>{`
        /* استایل اختصاصی برای جدول‌ها در موبایل */
        .table-container {
          width: 100%;
          overflow-x: auto; /* مهم: ایجاد اسکرول افقی در موبایل */
          -webkit-overflow-scrolling: touch;
          margin: 10px 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 12px;
          min-width: 400px; /* جلوگیری از فشرده شدن بیش از حد در موبایل */
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th { background: #f2f2f2; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {docs.map((doc, index) => (
          <details key={index} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '6px' }}>
            <summary style={{ padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              {doc.provider}
            </summary>
            {/* کانتینر اسکرول‌خور برای جدول‌ها */}
            <div className="table-container" style={{ padding: '10px' }} dangerouslySetInnerHTML={{ __html: doc.content }} />
          </details>
        ))}
      </div>
    </main>
  );
}
