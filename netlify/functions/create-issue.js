exports.handler = async function(event, context) {
  // Netlify function: create GitHub issue
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const secret = process.env.FORM_SECRET;
    const headerSecret = event.headers['x-form-secret'] || event.headers['X-Form-Secret'];
    if (!secret || headerSecret !== secret) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const owner = 'qzstatick';
    const repo = '.github';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      return { statusCode: 500, body: 'GITHUB_TOKEN not configured' };
    }

    const payload = JSON.parse(event.body || '{}');
    const title = (payload.title || '').toString().trim();
    if (!title) return { statusCode: 400, body: 'Title is required' };

    const body = (payload.body || '').toString();
    const labels = payload.labels ? payload.labels.split(',').map(s => s.trim()).filter(Boolean) : [];
    const assignees = payload.assignees ? payload.assignees.split(',').map(s => s.trim()).filter(Boolean) : [];

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
