const express = require('express');
const app = express();
const port = process.env.PORT||8010;
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

app.get('/hotel', (req, res) => {
  db.collection("hotel").find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.get('/hotel',(req,res) =>{
  var query = {}
  if(req.query.city_id){
      query={state_id:Number(req.query.city_id)}
      console.log(query)
  }else if(req.query.bookingtype){
      query={"mealTypes.mealtype_id":req.query.bookingtype}
  }
  db.collection('hotel').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/roomtype',(req,res) => {
  db.collection("roomtype").find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.get('/bookingtype',(req,res) => {
  db.collection("bookingtype").find().toArray((err,result) => {
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

//live api of project
//https://cherish-your-journey-api.herokuapp.com