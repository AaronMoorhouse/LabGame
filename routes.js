const {isTeamConnected} = require('./utils/teams');

//Define routes
function setRoutes(app) {
    //GET: index
    app.get('/', (req, res) => {
        //Attempt to retrieve session data from the request
        ssn = req.session;
        var error;

        //Get error message if one has been set and clear from session variable
        if(ssn.errorMsg !== null) {
            error = ssn.errorMsg;
            ssn.errorMsg = null;
        }

        //Render index template and pass error message to template
        res.render('index', {error: error});
        res.end();
    });

    //GET: room
    app.get('/room', (req, res) => {
        ssn = req.session;
        const team = req.query.team;
        const roomname = req.query.roomname;

        //Check URL parameter is valid and render room template
        const validParams = ['team1', 'team2', 'obs', 'fac'];

        if(!validParams.includes(req.query.team)) {
            ssn.errorMsg = "Error: Invalid URL";
            res.redirect('./');
        }
        //Check selected team is not already connected to specified room
        else if(team !== "obs" && isTeamConnected(team, roomname)) {
            if(team == "fac") {
                ssn.errorMsg = "Error: A facilitator is already connected to the specified room";
            }
            else {
                ssn.errorMsg = "Error: " + team + " is already connected to the specified room";
            }
            
            res.redirect('./');
        }
        else {
            res.render('room', {room: req.query.roomname});
        }

        res.end();
    });

    //POST: room
    app.post('/room', (req, res) => {
        //Get form data from POST request
        roomname = req.body.roomname;
        team = req.body.team;

        //Send GET request to room with valid team and room name
        res.redirect('/room?roomname=' + roomname + '&team=' + team);

        res.end();
    });
}

module.exports = {setRoutes};
