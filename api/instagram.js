// api/instagram.js — Apin Downloader
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL diperlukan' });

  try {
    // Use Insta downloader API
    const apiUrl = `https://api.instagramloader.io/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    // Fallback: try another public endpoint
    if (!data || data.status === 'error') {
      const r2 = await fetch('https://api.dlpanda.com/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const d2 = await r2.json();
      if (d2 && d2.medias && d2.medias.length > 0) {
        const formats = [];
        d2.medias.forEach(m => {
          if (m.type === 'video') formats.push({ type: 'nowm', label: 'Video (MP4)', url: m.url, ext: 'mp4' });
          if (m.type === 'audio') formats.push({ type: 'mp3', label: 'Audio MP3', url: m.url, ext: 'mp3' });
        });
        return res.status(200).json({ success: true, data: { title: 'Instagram Media', author: '', cover: d2.thumbnail || '', formats } });
      }
      return res.status(400).json({ error: 'Video tidak ditemukan. Pastikan link valid dan akun tidak private.' });
    }

    const formats = [];
    if (data.url) formats.push({ type: 'nowm', label: 'Video (MP4)', url: data.url, ext: 'mp4' });
    if (data.audio) formats.push({ type: 'mp3', label: 'Audio MP3', url: data.audio, ext: 'mp3' });

    return res.status(200).json({
      success: true,
      data: { title: data.title || 'Instagram Media', author: data.owner || '', cover: data.thumbnail || '', formats }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data: ' + err.message });
  }
}
