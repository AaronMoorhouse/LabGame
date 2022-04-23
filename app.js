//Import JS libraries
const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

//Import custom utils
const socket = require('./utils/socket');
const {hostname, port} = require('./config');
const {setRoutes} = require('./routes');

//Initialise express server and socket
const app = express();
const server = http.createServer(app);
const options = {allowEIO3: true};
const io = socketio(server, options);

//Variable to store session data
var ssn;
app.use(session({
    secret:'5hmNmq9r94a$u4GzHyA&*',
    resave: false,
    saveUninitialized: false,
    cookie: {sameSite: 'strict'}
}));

//Add Express middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set EJS as the template engine
app.set('view engine', 'ejs');

//Define routes
setRoutes(app);

//Initialise socket
socket(io);

//Start server
server.listen(port, hostname, () => {
    console.log('Server running on ' + hostname + ', port: ' + port)
});
