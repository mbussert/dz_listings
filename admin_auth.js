const handler = require('serve-handler');
const http = require('http');
const url = require('url');
const server = http.createServer((req, res) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  console.log(req.url);
  const reqUrl = url.parse(req.url).pathname;

  if (reqUrl != '/hello') {
    res.write('you\'re boring');
    res.end();
  }
  return handler(req, res, {
    cleanUrls: true,
    public: './data/db/',
  });
});

server.listen(3022, () => {
  console.log('Running at http://localhost:3022');
});
