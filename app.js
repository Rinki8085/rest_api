const express = require('express');
const app = express();
const port = 8000;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://document:rk123456@cluster0.gfit3.mongodb.net/2nd_Project?retryWrites=true&w=majority";
var db ;

//get
app.get('/', (req, res) => {
    res.send("Welcome to Api4")
})

//location
app.get('/location', (req, res) => {
  db.collection("location").find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.get('/Hotel', (req, res) => {
  db.collection("Hotelj").find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

MongoClient.connect(mongourl,(err,client) => {
  if(err) console.log("Error while connecting");
  db = client.db("2nd_Project");
  app.listen(port,() =>{
    console.log(`listening port number ${port}`)
  })
})