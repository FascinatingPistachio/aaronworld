// Enka.Network proxy — avoids CORS issues on Neocities
export default async function handler(req, res) {
  const uid = req.query.uid || '764275665';
  try {
    const response = await fetch(`https://enka.network/api/uid/${uid}`, {
      headers: { 'User-Agent': 'aaronworld-site/1.0' }
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
