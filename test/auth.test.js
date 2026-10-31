const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const server = require('../src/server');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

describe('Pruebas de Autenticación y Corrección del Issue #1', () => {
  before((done) => {
    server.listen(PORT, done);
  });

  after((done) => {
    server.close(done);
  });

  test('Prueba 1: Inicio de sesión con credenciales válidas retorna 200 y token', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 200);
    assert.ok(data.token);
    assert.strictEqual(data.user.role, 'ADMINISTRATOR');
  });

  test('Prueba 2: Inicio de sesión con credenciales inválidas retorna 401 controlado', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.error, 'Unauthorized');
  });

  test('Prueba 3: Solicitud con cuerpo malformado retorna 400 controlado', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ malformed json '
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
  });
});
