// api/youtube.js — Apin Downloader
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL diperlukan' });

  try {
    // Using yt-dlp web API via a public proxy
    const apiUrl = `https://api.vevioz.com/@api/button/mp3?url=${encodeURIComponent(url)}`;
    const infoUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;

    const [infoRes] = await Promise.allSettled([fetch(infoUrl)]);
    let title = 'YouTube Audio';
    let thumbnail = '';
    let author = '';

    if (infoRes.status === 'fulfilled') {
      const info = await infoRes.value.json();
      title = info.title || 'YouTube Audio';
      thumbnail = info.thumbnail_url || '';
      author = info.author_name || '';
    }

    const formats = [
      {
        type: 'mp3',
        label: 'Audio MP3 (128kbps)',
        url: `https://api.vevioz.com/@api/button/mp3?url=${encodeURIComponent(url)}`,
        ext: 'mp3',
        isRedirect: true
      }
    ];

    return res.status(200).json({ success: true, data: { title, author, cover: thumbnail, formats } });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data: ' + err.message });
  }
}
