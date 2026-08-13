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
      
      // تبدیل مارک‌داون به HTML
      const processedContent = await remark().use(html).process(fileContents);
      docs.push({
        title: file.replace('.md', ''),
        content: processedContent.toString()
      });
    }
  }
  return docs;
}

export default async function Home() {
  const docs = await getDocs();

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Vazirmatn, Tahoma, sans-serif', lineHeight: '1.8' }}>
      <header style={{ borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>داشبورد مستندات خودکار 🚀</h1>
        <p style={{ color: '#666' }}>این صفحه مستقیماً از منابع خارجی به‌روز می‌شود.</p>
      </header>

      {docs.length === 0 ? (
        <p>هنوز فایلی دانلود نشده است. منتظر اجرای اسکریپت بمانید یا گیت‌هاب اکشن را دستی اجرا کنید.</p>
      ) : (
        docs.map((doc, index) => (
          <section key={index} style={{ marginBottom: '50px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
            <h2 style={{ color: '#0070f3', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>{doc.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: doc.content }} />
          </section>
        ))
      )}
    </main>
  );
}
