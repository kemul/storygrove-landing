const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'site'));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
};
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }
    const headers = {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes'
    };
    if (req.headers.range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!match) {
        res.writeHead(416).end();
        return;
      }
      const start = Number(match[1]),
        end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start > end) {
        res.writeHead(416).end();
        return;
      }
      res.writeHead(206, {
        ...headers,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Content-Length': end - start + 1
      });
      fs.createReadStream(file, {
        start,
        end
      }).pipe(res);
    } else {
      res.writeHead(200, {
        ...headers,
        'Content-Length': stat.size
      });
      fs.createReadStream(file).pipe(res);
    }
  });
}).listen(4173, '127.0.0.1', () => console.log('Storygrove preview: http://127.0.0.1:4173'));
