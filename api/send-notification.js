const { Redis } = require('@upstash/redis');
const webpush = require('web-push');

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Redis is not configured.');
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  });
}

function isAuthorized(req) {
  const token = process.env.PUSH_ADMIN_TOKEN;
  return Boolean(token) && req.headers.authorization === `Bearer ${token}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { title, body, url = '/', tag = 'engineer-vault-update' } = req.body || {};
  if (typeof title !== 'string' || typeof body !== 'string' || !title.trim() || !body.trim()) {
    return res.status(400).json({ error: 'A title and body are required.' });
  }

  try {
    const redis = getRedis();
    const subscriptions = await redis.smembers('engineer-vault:push-subscriptions');
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:engineervaultnep@gmail.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const payload = JSON.stringify({ title: title.trim(), body: body.trim(), url, tag });
    let delivered = 0;
    let removed = 0;

    await Promise.all(subscriptions.map(async subscriptionText => {
      const subscription = JSON.parse(subscriptionText);
      try {
        await webpush.sendNotification(subscription, payload);
        delivered += 1;
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await redis.srem('engineer-vault:push-subscriptions', subscriptionText);
          removed += 1;
          return;
        }
        throw error;
      }
    }));

    return res.status(200).json({ ok: true, delivered, removed });
  } catch (error) {
    return res.status(503).json({ error: 'Notification could not be sent.' });
  }
};
