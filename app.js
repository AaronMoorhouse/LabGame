//Import JS libraries
const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

//Import custom utils
const socket = require('./utils/socket');
const {isTeamConnected} = require('./utils/teams');

//Initialise express server and socket
const app = express();
const server = http.createServer(app);
const options = {allowEIO3: true};
const io = socketio(server, options);

//Server port number
const PORT = process.env.PORT || 3000;

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

//Define routes:
//GET: index
app.get('/', (req, res) => {
    //Attempt to retrieve session data from the request
    ssn = req.session;
    var error;

    //Get error message if one has been set and clear from session variable
    if(ssn.errorMsg) {
        error = ssn.errorMsg;
        ssn.errorMsg = null;
    }

    //Render index template and pass error message to template
    res.render('index', {error: error});
    res.end();
});

//GET: room
app.get('/room', (req, res) => {
    //Check URL parameter is valid and render room template
    if(req.query.team == 'team1' || req.query.team == 'team2' || req.query.team == 'obs') {
        res.render('room');
    }
    else {
        ssn = req.session;
        ssn.errorMsg = "Error: Invalid URL";
        res.redirect('./');
    }

    res.end();
})

//POST: room
app.post('/room', (req, res) => {
    //Get form data from POST request
    roomname = req.body.roomname;
    team = req.body.team;

    //Check selected team is not already connected to specified room
    if(isTeamConnected(team, roomname)) {
        ssn = req.session;
        ssn.errorMsg = "Error: This team is already connected to the specified room";
        res.redirect('./');
    }
    else {
        //Send GET request to room with valid team and room name
        res.redirect('/room?roomname=' + roomname + '&team=' + team);
    }

    res.end();
});

//Initialise socket
socket(io);

//Start server
server.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
});
