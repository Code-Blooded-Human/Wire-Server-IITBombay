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

const log = require('log-to-file');

// Database Setup 
mongoose.connect('mongodb+srv://admin:QvKtRjjfewKiCDzh@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 3000;

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

//test

app.ws('/', function(ws, req) {
  handleWS(ws,wsConnections,expressWs);
});

function heartbeat(){
  this.isAlive = true;
  console.log("Recivied Heartbeat from mac: ", this.mac);

  log("Server got ping msg from mac: "+this.mac);
}

expressWs.getWss().on('connection', function(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  console.log('connection open');
  console.log(expressWs.getWss().clients);
});

const interval = setInterval(function ping() {
  expressWs.getWss().clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    console.log("Sending Ping to ",ws.mac);

    log("Server sending ping msg to mac: "+ws.mac);
    ws.ping();
  });
}, 30000);

Device.updateMany({status:'ACTIVE'},{status:'INACTIVE', lastDisconnected:Date.now()}).then(()=>{
  console.log("Set all devices to inactive");
  app.listen(PORT);
  console.log("RUNNING");

  log("Starting the server on PORT = "+PORT);
 
})
