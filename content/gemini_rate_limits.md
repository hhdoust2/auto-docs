# Gemini API Rate Limit & Grounding Documentation

## 1. Rate Limits by Model (Free Tier)

| Model                                            | Category                      | RPM           | TPM       | RPD           |
| ------------------------------------------------ | ----------------------------- | ------------- | --------- | ------------- |
| Antigravity                                      | Agents                        | 0 / 60        | 0 / 100K  | 0 / 100       |
| Deep Research Pro Preview                        | Agents                        | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 2.5 Flash Native Audio Dialog             | Live API                      | 0 / Unlimited | 0 / 1M    | 0 / Unlimited |
| Gemini 3 Flash Live                              | Live API                      | 0 / Unlimited | 0 / 65K   | 0 / Unlimited |
| Gemini 3.5 Live Translate                        | Live API                      | 0 / Unlimited | 0 / 20K   | 0 / Unlimited |
| Gemini 2.5 Flash TTS                             | Multi-modal generative models | 0 / 3         | 0 / 10K   | 0 / 10        |
| Gemini 2.5 Pro TTS                               | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 3.1 Flash TTS                             | Multi-modal generative models | 0 / 3         | 0 / 10K   | 0 / 10        |
| Gemini Omni Flash                                | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Imagen 4 Fast Generate                           | Multi-modal generative models | -             | -         | 0 / 25        |
| Imagen 4 Generate                                | Multi-modal generative models | -             | -         | 0 / 25        |
| Imagen 4 Ultra Generate                          | Multi-modal generative models | -             | -         | 0 / 25        |
| Lyria 3 Clip                                     | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Lyria 3 Pro                                      | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Nano Banana (Gemini 2.5 Flash Preview Image)     | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Nano Banana 2 (Gemini 3.1 Flash Image)           | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Nano Banana 2 Lite (Gemini 3.1 Flash Lite Image) | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Nano Banana Pro (Gemini 3 Pro Image)             | Multi-modal generative models | 0 / 0         | 0 / 0     | 0 / 0         |
| Veo 3 Fast Generate                              | Multi-modal generative models | 0 / 0         | -         | 0 / 0         |
| Veo 3 Generate                                   | Multi-modal generative models | 0 / 0         | -         | 0 / 0         |
| Veo 3 Lite Generate                              | Multi-modal generative models | 0 / 0         | -         | 0 / 0         |
| Computer Use Preview                             | Other models                  | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini Embedding 1                               | Other models                  | 0 / 100       | 0 / 30K   | 0 / 1K        |
| Gemini Embedding 2                               | Other models                  | 0 / 100       | 0 / 30K   | 0 / 1K        |
| Gemini Robotics ER 1.5 Preview                   | Other models                  | 0 / 10        | 0 / 250K  | 0 / 20        |
| Gemini Robotics ER 1.6 Preview                   | Other models                  | 0 / 5         | 0 / 250K  | 0 / 20        |
| Gemini Robotics ER 2 Preview                     | Other models                  | 0 / 5         | 0 / 250K  | 0 / 20        |
| Gemma 4 26B                                      | Other models                  | 0 / 30        | 0 / 16K   | 0 / 14.4K     |
| Gemma 4 31B                                      | Other models                  | 0 / 30        | 0 / 16K   | 0 / 14.4K     |
| Gemini 2 Flash                                   | Text-out models               | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 2 Flash Lite                              | Text-out models               | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 2.5 Flash                                 | Text-out models               | 0 / 5         | 0 / 250K  | 0 / 20        |
| Gemini 2.5 Flash Lite                            | Text-out models               | 0 / 10        | 0 / 250K  | 0 / 20        |
| Gemini 2.5 Pro                                   | Text-out models               | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 3 Flash                                   | Text-out models               | 0 / 5         | 0 / 250K  | 0 / 20        |
| Gemini 3.1 Flash Lite                            | Text-out models               | 0 / 15        | 0 / 250K  | 0 / 500       |
| Gemini 3.1 Pro                                   | Text-out models               | 0 / 0         | 0 / 0     | 0 / 0         |
| Gemini 3.5 Flash                                 | Text-out models               | 2 / 5         | 64 / 250K | 3 / 20        |
| Gemini 3.5 Flash Lite                            | Text-out models               | 0 / 15        | 0 / 250K  | 0 / 500       |
| Gemini 3.6 Flash                                 | Text-out models               | 0 / 5         | 0 / 250K  | 0 / 20        |
| Gemini 3.7 Flash                                 | Text-out models               | 0 / 5         | 0 / 250K  | 0 / 20        |

## 2. Tools Rate Limits

### Map Grounding

| Model                          | RPD     |
| ------------------------------ | ------- |
| Computer Use Preview           | 0 / 500 |
| Deep Research Pro Preview      | 0 / 500 |
| Gemini 2 Flash                 | 0 / 500 |
| Gemini 2.5 Flash               | 0 / 500 |
| Gemini 2.5 Flash Lite          | 0 / 500 |
| Gemini 2.5 Pro                 | 0 / 0   |
| Gemini 3 Flash                 | 0 / 0   |
| Gemini 3.1 Flash Lite          | 0 / 500 |
| Gemini 3.1 Flash TTS           | 0 / 500 |
| Gemini 3.1 Pro                 | 0 / 0   |
| Gemini 3.5 Flash               | 0 / 0   |
| Gemini 3.5 Flash Lite          | 0 / 500 |
| Gemini 3.6 Flash               | 0 / 0   |
| Gemini 3.7 Flash               | 0 / 0   |
| Gemini Robotics ER 1.6 Preview | 0 / 500 |
| Gemini Robotics ER 2 Preview   | 0 / 500 |

### Search Grounding

| Model      | RPD      |
| ---------- | -------- |
| Default    | 0 / 1.5K |
| Gemini 2   | 0 / 1.5K |
| Gemini 2.5 | 0 / 1.5K |
| Gemini 3   | 0 / 0    |


## 3. What is Map Grounding? (مفهوم زمینه‌سازی نقشه)

**Map Grounding** به فرآیندی گفته می‌شود که در آن مدل هوش مصنوعی برای پاسخ‌دهی به پرسش‌های مکانی و جغرافیایی، مستقیم به داده‌های واقعی و زنده نقشه‌ها (مانند Google Maps) متصل می‌شود.

### مزایا و کاربردها:
- **اطلاعات به‌روز و دقیق:** دسترسی به موقعیت مکانی، ساعات کاری، نظرات کاربران و آدرس‌های واقعی.
- **جلوگیری از Hallucination:** حذف پاسخ‌های ساختگی هوش مصنوعی درباره مکان‌ها.
- **کاربرد:** توسعه ربات‌های مسیریاب، دستیار سفر، سیستم‌های خدمات منطقه‌ای و کشف مکان‌های نزدیک.
