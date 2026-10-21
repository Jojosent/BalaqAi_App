import { validProfile } from './validation.js';

export function createHandler({ auth, database, allowedOrigins = ['http://localhost:8081'] }) {
  return async (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Vary', 'Origin');
    const send = (status, data) => { response.writeHead(status); response.end(JSON.stringify(data)); };
    const origin = request.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) return send(403, { error: 'Origin not allowed' });
    if (origin) response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    if (request.url === '/health' && request.method === 'GET') return send(200, { status: 'ok', service: 'balaqai-api' });
    if (request.url !== '/v1/me') return send(404, { error: 'Not found' });
    if (!['GET', 'PUT'].includes(request.method)) return send(405, { error: 'Method not allowed' });
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) return send(401, { error: 'Authentication required' });
    let identity;
    try { identity = await auth.verifyIdToken(token, true); }
    catch { return send(401, { error: 'Invalid or expired token' }); }
    const trustedProvider = identity.firebase?.sign_in_provider;
    if (!identity.email_verified && !['google.com', 'apple.com'].includes(trustedProvider)) return send(403, { error: 'Email verification required', code: 'EMAIL_NOT_VERIFIED' });
    // The document path always comes from the verified token, never the request body.
    const reference = database.collection('users').doc(identity.uid);
    try {
      if (request.method === 'GET') {
        const snapshot = await reference.get();
        return send(200, { data: snapshot.exists ? snapshot.data().data : null });
      }
      if (!request.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'JSON required' });
      const chunks = []; let bytes = 0;
      for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > 16_384) return send(413, { error: 'Request too large' });
        chunks.push(chunk);
      }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return send(400, { error: 'Invalid JSON' }); }
      if (!validProfile(data)) return send(400, { error: 'Invalid profile' });
      await reference.set({ data, updatedAt: new Date().toISOString() });
      return send(200, { saved: true });
    } catch (error) {
      // Do not log bearer tokens, personal data or credential contents.
      console.error('Profile storage failed:', error.code || 'unknown');
      return send(503, { error: 'Profile storage unavailable' });
    }
  };
}
