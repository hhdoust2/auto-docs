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
      docs.push({
        title: file.replace('.md', '').replace(/-/g, ' '),
        content: processedContent.toString()
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main dir="rtl" style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      fontFamily: 'Tahoma, Vazirmatn, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#1e293b'
    }}>
      {/* استایل‌های سراسری برای مرتب شدن جدول‌ها و محتوا */}
      <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          text-align: right;
          font-size: 14px;
        }
        th {
          background-color: #f1f5f9;
          color: #0f172a;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        p {
          margin-bottom: 14px;
          line-height: 1.8;
        }
        ul, ol {
          margin-right: 20px;
          margin-bottom: 14px;
        }
        li {
          margin-bottom: 6px;
        }
      `}</style>

      <header style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>داشبورد مستندات خودکار 🚀</h1>
        <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          مستندات و اطلاعات ذخیره‌شده به همراه جدول‌ها و جزییات کامل.
        </p>
      </header>

      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px' }}>
          <p>هنوز فایلی در پوشه content یافت نشد.</p>
        </div>
      ) : (
        docs.map((doc, index) => (
          <article key={index} style={{ 
            background: '#ffffff', 
            padding: '30px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              color: '#2563eb', 
              borderBottom: '2px solid #f1f5f9', 
              paddingBottom: '12px',
              fontSize: '20px',
              textTransform: 'capitalize'
            }}>
              {doc.title}
            </h2>
            
            <div dangerouslySetInnerHTML={{ __html: doc.content }} />
          </article>
        ))
      )}
    </main>
  );
}
