const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require('uuid');

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.id = uuidv4();
    req.body.createdAt = Date.now();
  }

  if (req.method === 'PUT') {
    req.body.updateAt = Date.now();
  }

  setTimeout(next, 1000);
});

// Use default router
server.use('/api/v1', router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
