const http = require('http'); // va générer à chaque appel le package http de node
const app = require('./app');  // va aller chercher le fichier app.js dans lequel on exporte le module app généré par express

const normalizePort = val => { // renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => { //recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);  // méthode createServer du package http 

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // va se mettre à l'écoute du port : process.env.PORT => plateform propose port par défaut, sinon port 3000
