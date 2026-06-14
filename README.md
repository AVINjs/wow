# Apin Downloader 🔽

Web app downloader multi-platform: TikTok, Instagram, YouTube, Pinterest.

## ✨ Fitur

- **TikTok**: No Watermark, HD, Audio MP3, Slide Foto
- **Instagram**: Video, Audio MP3
- **YouTube**: Audio MP3
- **Pinterest**: GIF & Gambar
- Auto-paste dari clipboard
- Share Target (bisa di-share langsung dari app)
- Nama file otomatis: `apin downloader N.ext`
- Counter download tersimpan di browser

---

## 🚀 Deploy ke Vercel

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "Apin Downloader v1.0"
git remote add origin https://github.com/USERNAME/apin-downloader.git
git push -u origin main
```

### 2. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) → New Project
2. Import repo GitHub tadi
3. Framework: **Other** (tidak perlu pilih framework)
4. Click **Deploy**
5. Selesai! Dapat URL otomatis dari Vercel

---

## 📱 Pasang sebagai App (PWA)

### Android (Chrome):
1. Buka URL Vercel di Chrome
2. Tap menu (⋮) → **Add to Home Screen**
3. App muncul di homescreen

### iOS (Safari):
1. Buka URL Vercel di Safari
2. Tap Share → **Add to Home Screen**

---

## 🔗 Share Target (Auto-Paste Link)

Setelah pasang sebagai PWA:
1. Buka TikTok/Instagram → Share video
2. Pilih **Apin Downloader** dari daftar share
3. Link otomatis ke-paste dan langsung dicari

---

## 📁 Struktur Project

```
apin-downloader/
├── index.html          ← UI utama
├── manifest.json       ← Config PWA
├── sw.js              ← Service Worker (share target)
├── vercel.json        ← Config routing Vercel
└── api/
    ├── tiktok.js      ← API TikTok (tikwm.com)
    ├── instagram.js   ← API Instagram
    ├── youtube.js     ← API YouTube MP3
    └── pinterest.js   ← API Pinterest GIF
```

---

## ⚠️ Catatan

- API serverless butuh Node.js runtime (sudah di-handle Vercel otomatis)
- Untuk domain custom, bisa setting di Vercel dashboard
- Rate limit mungkin berlaku di beberapa API eksternal
# wow
