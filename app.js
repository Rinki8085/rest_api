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
  if(req.query.cityid){
      query={city_id:Number(req.query.cityid)}
      console.log(query)
  }else if(req.query.bookingtype){
      query={"bookingType:bookingtype_id":req.query.bookingtype}
  }
  db.collection('hotel').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/filter/:roomtype',(req,res) => {
  var sort = {cost:1}
  var skip = 0;
  var limit = 1000000000000;
  if(req.query.sortkey){
      sort = {cost:req.query.sortkey}
  }
  if(req.query.skip && req.query.limit){
      skip = Number(req.query.skip);
      limit = Number(req.query.limit)
  }
  var type = req.params.roomtype;
  var query = {"type.roomtype_id":Number(type)};
  if(req.query.roomType && req.query.lcost && req.query.hcost){
      query={
          $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
          "type.roomtype_id":Number(req.query.tripType),
          "type.bookingtype_id":Number(type)
      }
  }
  else if(req.query.tripType){
      query = {"Type.roomType_id":roomtype,"tripType.trip_id":Number(req.query.tripType) }
  }
  else if(req.query.lcost && req.query.hcost){
      var lcost = Number(req.query.lcost);
      var hcost = Number(req.query.hcost);
      query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"type.roomType_id":Number(roomtype)}
  }
  db.collection('hotel').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/quicksearch',(req,res) =>{
  db.collection('tripType').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

// restaurant Details
app.get('/details/:id',(req,res) => {
  var id = req.params.id
  db.collection('hotel').find({id:Number(id)}).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

//menu Details
app.get('/menu/:id',(req,res) =>{
  var id = req.params.id
  db.collection('Restaurantmenu').find({restaurant_id:Number(id)}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

// place order 
app.post('/bookingPlace',(req,res) => {
  console.log(req.body);
  db.collection('booking').insert(req.body,(err,result) => {
      if(err) throw err;
      res.send(result)
  })
})

app.get('/viewBookings',(req,res) => {
  var query = {}
  if(req.query.email){
      query = {email:req.query.email}
  }
  db.collection('booking').find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.get('/viewBookings/:id',(req,res) => {
  var id = mongo.ObjectId(req.params.id);
  db.collection('booking').find({_id:id}).toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})


app.delete('/cancelBooking',(req,res) => {
  db.collection('booking').remove({},(err,result)=>{
      if(err) throw err;
      res.send(result)
  })
})

app.put('/updateStatus/:id',(req,res) => {
  var id = mongo.ObjectId(req.params.id);
  var status = 'Pending';
  var statuVal = 2
  if(req.query.status){
      statuVal = Number(req.query.status)
      if(statuVal == 1){
          status = 'Accepted'
      }else if (statuVal == 0){
          status = 'Rejected'
      }else{
          status = 'Pending'
      }
  }
  db.collection('booking').updateOne(
      {_id:id},
      {
          $set:{
             "status": status
          }
      }, (err,result) => {
          if(err) throw err;
          res.send(`Your order status is ${status}`)
      }
  )
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