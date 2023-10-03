//Template elements
const roomText = $('#room-text');
const roleText = $('#role-text');
const team1Status = $('#team1-status');
const team2Status = $('#team2-status');
const table = $('#table');

//Connect client to server
const socket = io.connect();

//Get params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const team = urlParams.get('team');
const roomname = urlParams.get('roomname');

//Game variables
var roundInProgress = false;
var roundNo = 1;

//Display room name and view type
roomText.html("Room: " + roomname);

switch(team) {
    case 'team1': roleText.html('Team A'); break;
    case 'team2': roleText.html('Team B'); break;
    case 'fac': roleText.html('Facilitator'); break;
    case 'obs': roleText.html('Observer'); break;
}

//Notify that your team has joined the room
socket.emit('joined-team', {
    teamNo: team,
    room: roomname
});

//Listen for other team joining/leaving the room
socket.on('online-teams', ({room, teams, scores, colours, inProgress}) => {
    const teamStrings = [];

    teams.forEach(team => {
        teamStrings.push(team.teamNo);
    });

    if(teamStrings.includes("team1")) {
        team1Status.html("Connected");
        team1Status.css('color', 'green');
    }
    else {
        team1Status.html("Not connected");
        team1Status.css('color', 'red');
    }

    if(teamStrings.includes("team2")) {
        team2Status.html("Connected");
        team2Status.css('color', 'green');
    }
    else {
        team2Status.html("Not connected");
        team2Status.css('color', 'red');
    }

    roundInProgress = inProgress;
    updateTable(scores, colours);

    if(!roundInProgress && roundNo <= 10 && team != 'obs') { 
        waitRoundStart(colours);
    }
});

//Listen for start of round - facilitator initiates the round
socket.on('start-round', ({room}) => {
    roundInProgress = true;
    hideDialog();
});

//Listen for end of round - both teams have selected a colour
socket.on('round-complete', ({room, scores, colours}) => {
    roundInProgress = false;
    updateTable(scores, colours);

    if(roundNo <= 10 && team != 'obs') {
        waitRoundStart(colours);
    }
});

init();

/**
 * Initialise the game by rendering the table and displaying the colour options for the user's team.
 */
function init() {
    drawGrid(11, 5);

    if(team == 'team1') {
        showColourOptions(1);
    }
    else if(team == 'team2') {
        showColourOptions(3);
    }

    displayTotalScores([]);
}

/**
 * Update the table of with selected colours and resulting scores after a round.
 * 
 * @param {Array<Object>} scores The array of score objects containing the round scores for the current room
 * @param {Array<Object} colours The array of colour objects containing the selected colours for the current room
 */
function updateTable(scores, colours) {
    //Check the game has been initiated
    if((scores != null && scores.length > 0) && (colours != null && colours.length > 0)) {
        displayRoundResults(scores, colours);
        displayTotalScores(scores);

        //Determine the round number
        roundNo = scores.length + 1;

        //Check whether all rounds have been played
        if(roundNo <= 10) {
            //Show colour options on the correct row depending on the round number
            if(team == 'team1') {
                showColourOptions((roundNo * 5) - 4);
            }
            else if(team == 'team2') {
                showColourOptions((roundNo * 5) - 2);
            }
        }
        else {
            //Notify the server the game is over
            socket.emit('game-over', {
                room: roomname
            });
        }
    }
}

/**
 * Display dialog between rounds.
 * 
 * @param {Array<Object>} colours The array of colour objects containing the selected colours for the current room
 */
function waitRoundStart(colours) {
    showDialog(colours);

    //Add listener to 'start round' button on facilitator view
    $('#start-button').on('click', () => {
        socket.emit('start-round', {
            room: roomname
        });
    });
}