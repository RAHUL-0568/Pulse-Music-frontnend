export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const query = new URLSearchParams(req.query).toString();
        const targetUrl = `https://amz.geeked.wtf/api/track/?${query}`;

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://amz.geeked.wtf/',
            'Origin': 'https://amz.geeked.wtf'
        };

        // Forward any bypass_token if passed
        if (req.headers['x-turnstile-jwt']) {
            headers['X-Turnstile-JWT'] = req.headers['x-turnstile-jwt'];
        }

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers
        });

        const data = await response.text();
        // Forward content-type (JSON)
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
        res.status(response.status).send(data);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Vercel proxy fetch failed' });
    }
}
