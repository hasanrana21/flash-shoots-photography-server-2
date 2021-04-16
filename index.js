const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7tlf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("servicesCard");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviewsCard");

  app.post('/addServiceData', (req, res) => {
      serviceCollection.insertOne(req.body)
      .then(data =>{
          res.send(data.insertedCount > 0);
      })
  })

  app.get('/getServiceData', (req, res) => {
      serviceCollection.find()
      .toArray((err, serviceItems) => {
          res.send(serviceItems)
      })
  })


  app.post('/addReview', (req, res) => {
      reviewCollection.insertOne(req.body)
      .then(review => {
          res.send(review.insertedCount > 0)
      })
  })

  app.get('/getReview', (req, res) => {
      reviewCollection.find()
      .toArray((err, reviewItem) => {
          res.send(reviewItem);
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8050)