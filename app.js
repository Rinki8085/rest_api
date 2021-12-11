const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT||8010;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors = require('cors')
// to receive data from form
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())

/*const mongourl = "mongodb://localhost:27017"*/
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

// tripType
app.get('/tripType', (req, res) => {
  db.collection("tripType").find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

//localhost:8010/hotel?cityid=1
//list of hotel with respect to cityId
app.get('/hotel',(req,res) =>{
  var query = {}
  if(req.query.cityid){
      query={"city_id":Number(req.query.cityid)}
  }else if(req.query.roomtype_id){
      query={"roomType.roomtype_id":req.query.roomtype_id} 
      console.log(query)
  }
  db.collection('hotel').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result) 
  })
})

app.get('/hotel',(req,res) =>{
  var query = {}
  if(req.query.roomtype_id){
      query={"tripType.triptype_id":req.query.triptype_id} 
  }
  db.collection('hotel').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result) 
  })
})

app.get('/hotel/:id',(req,res) => {
  var id = Number(req.params.id)
  console.log(id)
  db.collection('hotel').find({id:id}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    console.log(result)
  })
})

app.get('/filter/:tripType',(req,res) => {
  var sort = {cost:1}
  var skip = 0;
  var limit = 1000000000000;
  var tripType = req.params.tripType;
  var query = {"tripType.triptype_id":tripType};
  console.log(query)

  if(req.query.sortkey){
      sort = {cost:req.query.sortkey}
  }
  if(req.query.skip && req.query.limit){
      skip = Number(req.query.skip);
      limit = Number(req.query.limit)
  }
  if(req.query.roomType && req.query.lcost && req.query.hcost){
      query={
          $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
          "roomType.roomtype_id":req.query.roomType,
          "tripType.triptype_id":tripType
      }
  }
  else if(req.query.roomType){
      query = {"roomType.roomtype_id":req.query.roomType,"tripType.triptype_id":tripType }
  }
  else if(req.query.lcost && req.query.hcost){
      var lcost = Number(req.query.lcost);
      var hcost = Number(req.query.hcost);
      query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"tripType.triptype_id":tripType}
      console.log(query)
  }
  db.collection('hotel').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/quicksearch',(req,res) =>{
  db.collection('roomType').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

// place order 
app.post('/BookPlace',(req,res) => {
  console.log(req.body);
  db.collection('orders').insertMany(req.body,(err,result) => {
      if(err) throw err;
      res.send("Order Placed")
  })
})

app.get('/viewBooking',(req,res) => {
  var query = {}
  if(req.query.email){
      query = {email:req.query.email}
  }
  db.collection('bookings').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/viewBooking/:id',(req,res) => {
  var id = mongo.ObjectId(req.params.id);
  db.collection('bookings').find({_id:id}).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.delete('/deletebooking',(req,res) => {
  db.collection('bookings').remove({},(err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.put('/updateBooking/:id',(req,res) => {
  var id = Number(req.params.id);
  var status = req.body.status?req.body.status:"Booked";
  db.collection('orders').updateOne(
      {id:id},
      {
          $set:{
              "date":req.body.date,
              "bank_status":req.body.bank_status,
              "bank":req.body.bank,
              "status":status
          }
      }
  )
  res.send('data updated')
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