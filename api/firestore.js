export default async function handler(req, res) {
  const { collection, doc } = req.query;
  const FS_BASE = 'https://firestore.googleapis.com/v1/projects/poig-website/databases/(default)/documents';
  const FS_KEY = 'AIzaSyDSjK2bk_WN7A_ec4x58UmqnDQmQ-wJaMM';

  const path = doc ? `${collection}/${doc}` : collection;
  const url = `${FS_BASE}/${path}?key=${FS_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Cache-Control', 'public, s-maxage=30');
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'fetch failed' });
  }
}
