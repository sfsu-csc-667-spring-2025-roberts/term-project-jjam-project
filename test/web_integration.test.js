// web_integration.test.js
// Easy-to-run integration test suite for lobby & chat web functions
// Run with: npx jest test/web_integration.test.js

const request = require('supertest');
const io = require('socket.io-client');
const fs = require('fs');
const serverUrl = 'http://localhost:3000';

const testAccount = JSON.parse(fs.readFileSync(__dirname + '/test_account.json', 'utf-8'));
let cookie = '';

beforeAll(async () => {
  // Register or login test account and store session cookie
  let res = await request(serverUrl)
    .post('/auth/register')
    .send({ email: testAccount.email, password: testAccount.password });
  // If already registered, try to login
  if (res.statusCode === 200 || res.statusCode === 302) {
    // Success, get cookie
    cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : '';
  } else {
    res = await request(serverUrl)
      .post('/auth/login')
      .send({ email: testAccount.email, password: testAccount.password });
    cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : '';
  }
});

describe('Lobby & Chat Web Integration', () => {
  let lobbyId, userId1, userId2, socket1, socket2;

  test('Create a lobby (accept 302)', async () => {
    const res = await request(serverUrl)
      .post('/lobby/create')
      .set('Cookie', cookie)
      .send({ name: 'Test Lobby' });
    if (res.headers['content-type'] && res.headers['content-type'].includes('text/html')) {
      throw new Error('Received HTML instead of JSON. Not authenticated?');
    }
    expect([200, 302]).toContain(res.statusCode);
  });

  test('List lobbies and extract lobbyId', async () => {
    const res = await request(serverUrl)
      .get('/lobby/list')
      .set('Cookie', cookie);
    if (res.headers['content-type'] && res.headers['content-type'].includes('text/html')) {
      throw new Error('Received HTML instead of JSON. Not authenticated?');
    }
    expect([200, 302]).toContain(res.statusCode);
    // Try to parse JSON body even if redirected
    let lobbies = res.body;
    if (!Array.isArray(lobbies)) {
      try { lobbies = JSON.parse(res.text); } catch {}
    }
    expect(Array.isArray(lobbies)).toBe(true);
    expect(lobbies.length).toBeGreaterThan(0);
    lobbyId = lobbies[0].id;
    expect(lobbyId).toBeDefined();
  });

  test('Join lobby as two users (accept 302)', async () => {
    userId1 = 'testuser1';
    userId2 = 'testuser2';
    const join1 = await request(serverUrl)
      .post('/lobby/join')
      .set('Cookie', cookie)
      .send({ lobbyId, userId: userId1 });
    const join2 = await request(serverUrl)
      .post('/lobby/join')
      .set('Cookie', cookie)
      .send({ lobbyId, userId: userId2 });
    if (join1.headers['content-type'] && join1.headers['content-type'].includes('text/html')) {
      throw new Error('Received HTML instead of JSON. Not authenticated?');
    }
    expect([200, 302]).toContain(join1.statusCode);
    expect([200, 302]).toContain(join2.statusCode);
  });

  test('Socket.IO real-time chat', (done) => {
    jest.setTimeout(15000); // Increase timeout for async
    socket1 = io(serverUrl, { transports: ['websocket'] });
    socket2 = io(serverUrl, { transports: ['websocket'] });
    let cleanup = () => {
      if (socket1) socket1.disconnect();
      if (socket2) socket2.disconnect();
    };
    let received = 0;
    socket1.emit('joinLobby', { lobbyId, userId: userId1 });
    socket2.emit('joinLobby', { lobbyId, userId: userId2 });
    socket2.on('chatMessage', (data) => {
      if (data.lobbyId === lobbyId && data.chat.some(m => m.message === 'Hello from test!')) {
        received++;
        if (received === 1) {
          cleanup();
          done();
        }
      }
    });
    setTimeout(() => {
      socket1.emit('chatMessage', { lobbyId, userId: userId1, message: 'Hello from test!' });
    }, 500);
    setTimeout(() => {
      cleanup();
      done.fail('Socket.IO chat test timed out');
    }, 12000);
  });
});

// To run: npx jest test/web_integration.test.js
