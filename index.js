const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
  const userOrderCollection = client.db(`${process.env.DB_NAME}`).collection("orderedData");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("Admin");

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


  app.post('/addOrder', (req, res) => {
      userOrderCollection.insertOne(req.body)
      .then(orderResult => {
          res.send(orderResult.insertedCount > 0)
      } )
  })

  app.get('/getOrdered', (req, res) => {
      userOrderCollection.find(req.body)
      .toArray((err, orderedData) => {
          res.send(orderedData);
      })
  })


  app.post('/addAdmin', (req, res) => {
      adminCollection.insertOne(req.body)
      .then(admin => {
          res.send(admin.insertedCount > 0);
      })
  })


//   app.delete('/delete/:id', (req, res) => {
//     //   const deletedID = req.params.id;
//       serviceCollection.findOneAndDelete({_id: ObjectID(req.params.id)})
//       .then(deleted => {
//         console.log(deleted)
//       })
//   })

app.post('/updateOrder', (req, res) => {
    console.log(req.body.updateID);
    userOrderCollection.updateOne({_id: ObjectID(req.body.updateID)}, {$set: req.body.updateStatus})

})


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||8050)