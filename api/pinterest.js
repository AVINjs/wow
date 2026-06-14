// api/pinterest.js — Apin Downloader
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL diperlukan' });

  try {
    const pinMatch = url.match(/\/pin\/(\d+)/);
    if (!pinMatch) return res.status(400).json({ error: 'Link Pinterest tidak valid' });

    const pinId = pinMatch[1];
    const apiUrl = `https://api.pinterest.com/v1/pins/${pinId}/?fields=id,link,note,url,media,image&access_token=`;

    // Scrape the Pinterest page directly
    const pageRes = await fetch(`https://www.pinterest.com/pin/${pinId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    const html = await pageRes.text();

    // Extract JSON data from page
    const jsonMatch = html.match(/"story_pin_data_id":\s*null[^}]*"images":\s*(\{[^}]+\})/);
    let gifUrl = null;
    let coverUrl = null;
    let title = 'Pinterest GIF';

    // Try to find video/gif URL
    const videoMatch = html.match(/"url":"(https:\/\/v\.pinimg\.com\/[^"]+\.gif[^"]*)"/);
    if (videoMatch) gifUrl = videoMatch[1].replace(/\\u002F/g, '/');

    // Try image URL
    const imgMatch = html.match(/"orig":\s*\{"url":"([^"]+)"/);
    if (imgMatch) coverUrl = imgMatch[1].replace(/\\u002F/g, '/');

    const titleMatch = html.match(/"seo_description":"([^"]+)"/);
    if (titleMatch) title = titleMatch[1];

    const formats = [];
    if (gifUrl) formats.push({ type: 'gif', label: 'Download GIF', url: gifUrl, ext: 'gif' });
    else if (coverUrl) formats.push({ type: 'gif', label: 'Download Gambar', url: coverUrl, ext: 'jpg' });

    if (formats.length === 0) return res.status(400).json({ error: 'Konten GIF tidak ditemukan di link ini' });

    return res.status(200).json({ success: true, data: { title, author: '', cover: coverUrl || gifUrl, formats } });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data: ' + err.message });
  }
}
