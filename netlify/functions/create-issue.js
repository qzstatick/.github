exports.handler = async function(event, context) {
  // Netlify function: create GitHub issue
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Minimal secret check (optional) — set FORM_SECRET in Netlify env and send as X-Form-Secret header
    const FORM_SECRET = process.env.FORM_SECRET;
    const headerSecret = event.headers['x-form-secret'] || event.headers['X-Form-Secret'];
    if (FORM_SECRET && headerSecret !== FORM_SECRET) {
      return { statusCode: 401, body: 'Unauthorized (invalid FORM_SECRET)' };
    }

    // Optional origin check
    const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN; // e.g. https://your-site.netlify.app
    const origin = event.headers.origin || event.headers.Origin || '';
    if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
      return { statusCode: 403, body: 'Forbidden origin' };
    }

    const owner = 'qzstatick';
    const repo = '.github';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      return { statusCode: 500, body: 'GITHUB_TOKEN not configured' };
    }

    // parse payload
    let payload = {};
    try { payload = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }

    const title = (payload.title || '').toString().trim();
    if (!title) return { statusCode: 400, body: 'Title is required' };

    const body = (payload.body || '').toString();
    const labels = payload.labels ? payload.labels.split(',').map(s => s.trim()).filter(Boolean) : [];
    const assignees = payload.assignees ? payload.assignees.split(',').map(s => s.trim()).filter(Boolean) : [];

    // Optional reCAPTCHA verification
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
    if (RECAPTCHA_SECRET) {
      const token = payload.recaptchaToken;
      if (!token) return { statusCode: 401, body: 'recaptchaToken required' };

      const formBody = `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`;
      const recRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
      });
      const recJson = await recRes.json();
      if (!recJson.success || (recJson.score && recJson.score < 0.5)) {
        return { statusCode: 401, body: 'reCAPTCHA verification failed' };
      }
    }

    // Create issue via GitHub API
    const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, labels, assignees })
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return { statusCode: apiRes.status || 500, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ html_url: data.html_url, number: data.number, url: data.url })
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
