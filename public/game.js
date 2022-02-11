//Template elements
const roomText = $('#room-text');
const team1Status = $('#team1-status');
const team2Status = $('#team2-status');
const table = $('#table');

//Socket server URL
const socket = io.connect('http://localhost:3000');

//Get params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const team = urlParams.get('team');
const roomname = urlParams.get('roomname');

//Game variables
var roundNo = 1;

roomText.html("Room: " + roomname);

//Notify that your team has joined the room
socket.emit('joined-team', {
    teamNo: team,
    room: roomname
});

//Listen for other team joining/leaving the room
socket.on('online-teams', ({room, teams, scores, colours}) => {
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

    updateTable(scores, colours);
});

//Listen for end of round - both teams have selected a colour
socket.on('round-complete', ({room, scores, colours}) => {
    updateTable(scores, colours);
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