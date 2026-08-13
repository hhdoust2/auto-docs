import os
import requests

# پوشه‌ای که فایل‌ها در آن ذخیره می‌شوند تا ورسل آن‌ها را رندر کند
OUTPUT_DIR = "content"
URLS_FILE = "urls.txt"

def main():
    if not os.path.exists(URLS_FILE):
        print(f"فایل {URLS_FILE} پیدا نشد.")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(URLS_FILE, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    for url in urls:
        try:
            print(f"در حال دریافت: {url}")
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                # ساخت یک نام فایل امن از روی آدرس اینترنتی
                file_name = url.split("/")[-1]
                if not file_name.endswith(".md"):
                    file_name += ".md"
                
                file_path = os.path.join(OUTPUT_DIR, file_name)
                
                with open(file_path, "w", encoding="utf-8") as out_f:
                    out_f.write(response.text)
                print(f"ذخیره شد: {file_path}")
            else:
                print(f"خطا در دریافت {url} - کد وضعیت: {response.status_code}")
        except Exception as e:
            print(f"خطا در پردازش {url}: {e}")

if __name__ == "__main__":
    main()
