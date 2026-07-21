module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(503).json({ error: 'Notifications are not configured.' });
  }

  return res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
