// api/tiktok.js — Apin Downloader
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL diperlukan' });

  try {
    const response = await fetch('https://api.tikwm.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ url, count: 12, cursor: 0, web: 1, hd: 1 })
    });
    const data = await response.json();
    if (data.code !== 0) return res.status(400).json({ error: 'Video tidak ditemukan atau link tidak valid' });

    const d = data.data;
    const result = {
      title: d.title || 'TikTok Video',
      author: d.author?.nickname || '',
      cover: d.cover || '',
      duration: d.duration || 0,
      formats: []
    };

    if (d.play) result.formats.push({ type: 'nowm', label: 'No Watermark (MP4)', url: d.play, ext: 'mp4' });
    if (d.hdplay) result.formats.push({ type: 'hd', label: 'HD No Watermark (MP4)', url: d.hdplay, ext: 'mp4' });
    if (d.music) result.formats.push({ type: 'mp3', label: 'Audio MP3', url: d.music, ext: 'mp3' });
    if (d.images && d.images.length > 0) {
      result.formats.push({ type: 'slides', label: `Slide Foto (${d.images.length} foto)`, url: d.images, ext: 'zip', isSlide: true });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data: ' + err.message });
  }
}
