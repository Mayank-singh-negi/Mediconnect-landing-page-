import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname);
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = normalize(join(root, requested));
  const publicFile = normalize(join(root, 'public', requested));
  if (!file.startsWith(root)) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  try {
    let resolvedFile = file;
    try { await stat(resolvedFile); } catch { resolvedFile = publicFile; }
    if (!resolvedFile.startsWith(root)) throw new Error('Invalid path');
    const data = await readFile(resolvedFile);
    response.writeHead(200, { 'Content-Type': types[extname(resolvedFile)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`MediConnect listening on 0.0.0.0:${port}`));
