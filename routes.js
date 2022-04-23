const {isTeamConnected} = require('./utils/teams');

//Define routes
function setRoutes(app) {
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
            res.render('room', {room: req.query.roomname});
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
}

module.exports = {setRoutes};
