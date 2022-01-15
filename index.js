const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
var handleWS = require('./ws/main');
const WSConnectionManager = require('./classes/WSConnectionManager');
var authApiRouter = require("./api/auth");
var deviceApiRouter = require("./api/device");
var bodyParser = require('body-parser')
var statisticsRouter = require('./api/statistics');
const authenticateUserMiddleware = require('./middlewares/authenticateUserMiddleware');
const Device = require('./models/device');

// Database Setup 
mongoose.connect('mongodb+srv://admin:IW0BGph6eQOZRQLP@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 5000;

var app = express();
app.use(cors());
var expressWs = require('express-ws')(app);

var wsConnections =  new WSConnectionManager();
app.use(express.static('static'))
app.use(bodyParser.json({ type: 'application/json' }))




app.get('/', function(req, res, next){
  res.send("Server Running",200);
});

app.use((req,res,next)=>{
  req.wsConnections = wsConnections; 
  next();
});

app.use('/api/auth',authApiRouter)

app.use('/api/device', authenticateUserMiddleware);
app.use('/api/device',deviceApiRouter);

app.use('/api/statistics', authenticateUserMiddleware);
app.use('/api/statistics',statisticsRouter);

// app.use('/api/whoami', authenticateUserMiddleware);
// app.get('/api/whoami',whoami);

app.ws('/', function(ws, req) {
  handleWS(ws,wsConnections);
});

Device.updateMany({status:'ACTIVE'},{status:'INACTIVE', lastDisconnected:Date.now()}).then(()=>{
  console.log("Set all devices to inactive");
  app.listen(PORT);
  console.log("RUNNING");
})
