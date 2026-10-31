const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const credentials = body ? JSON.parse(body) : {};
        const { username, password } = credentials;

        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            status: 400,
            error: 'Bad Request',
            message: 'El nombre de usuario y la contraseña son requeridos'
          }));
        }

        // Validación controlada de credenciales
        if (username === 'admin' && password === 'admin123') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            status: 200,
            token: 'jwt-auth-session-token-valid',
            user: { username: 'admin', role: 'ADMINISTRATOR' },
            message: 'Inicio de sesión exitoso. Redirigiendo al panel principal.'
          }));
        }

        // Credenciales inválidas
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          status: 401,
          error: 'Unauthorized',
          message: 'Credenciales inválidas. Verifique su usuario y contraseña.'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          status: 400,
          error: 'Bad Request',
          message: 'Formato de solicitud no válido (JSON malformado)'
        }));
      }
    });
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

module.exports = server;
