const express = require ("express"); // importe le package express
const bodyParser = require ("body-parser"); // importe le package body-parser pour être en mesure de rendre les données du corps de la requête exploitable
const mongoose = require ("mongoose"); // Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles.
const path = require ("path"); // donne la possibilité de gérer et transformer les chemins d'accès
const helmet = require ("helmet");
require ("dotenv").config();


const sauceRoutes = require ("./routes/sauce");
const userRoutes = require ("./routes/user");

const app = express();
app.use(helmet());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6onzl.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //accéde à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajoute les headers mentionnés aux requêtes envoyées vers notre API 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer des requêtes avec les méthodes mentionnées
  next();
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;