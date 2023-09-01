const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Product = require('./models/Product');


//Connexion à Mongo DB Atlas
mongoose.connect('mongodb+srv://alexios:GzSAUhOFt27y8pgyWIy@cluster0.aiswn1y.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json()); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();
});


//Enregistre les données dans la base de données
app.post('/api/products', (req, res, next) =>{
  delete req.body.__v ;
  const product = new Product({

      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,

  });
  product.save()
  .then(product => res.status(201).json({ product}))
  .catch(error => res.status(400).json({ error }));
});
//Modifie les données
app.put('/api/products/:id', (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!'}))
    .catch(error => res.status(400).json({ error }));
});
// Supprime les données
app.delete('/api/products/:id', (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!'}))
    .catch(error => res.status(400).json({ error }));
});
app.get('/api/products/:id', (req, res, next) => {
  Product.findOne({_id: req.params.id })
    .then(product => {
      console.log(product); // Pour vérifier la valeur que nous avons obtenue de la requête
      res.status(200).json({product});
    })
    .catch(err => {
      console.log(err);
    });
});
// Renvois la liste des Produits en vente
app.get('/api/products', (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({ products }); // Utilisation de la clé "products" dans la réponse JSON
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits.' });
    });
});

module.exports = app;