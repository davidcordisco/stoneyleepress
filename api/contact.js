export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, product, type, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  const RESEND_KEY = process.env.RESEND_API_KEY;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({
      from: 'Stoney Lee Press <noreply@stoneyleepress.com>',
      to: 'hello@stoneyleepress.com',
      reply_to: email,
      subject: `[${product || 'General'}] ${type || 'Contact'} from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Product:</strong> ${product}</p><p><strong>Type:</strong> ${type}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`
    })
  });

  if (!r.ok) return res.status(500).json({ error: 'Failed to send' });
  return res.status(200).json({ ok: true });
}
