const { Redis } = require('@upstash/redis');

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Redis is not configured.');
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const subscription = req.body;
  if (!subscription || typeof subscription.endpoint !== 'string' || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return res.status(400).json({ error: 'Invalid push subscription.' });
  }

  try {
    const redis = getRedis();
    await redis.sadd('engineer-vault:push-subscriptions', JSON.stringify(subscription));
    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(503).json({ error: 'Notification subscriptions are not available yet.' });
  }
};
