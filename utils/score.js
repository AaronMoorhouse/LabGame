var colours = []; //{team1: red, team2: blue, room: roomname}
var roundScores = []; //{team1: 6, team2: -6, room: roomname}
var roundsInProgress = [];

function addColour(teamNo, colour, room) {
    const currentColours = getColours(room);
    var data = currentColours[currentColours.length - 1];

    if(isRoundComplete(data) || currentColours.length == 0) {
        data = {};

        if(teamNo == 'team1') {
            data = {team1: colour, room: room};
        }
        else {
            data = {team2: colour, room: room};
        }

        colours.push(data);
    }
    else {
        if(teamNo == 'team1') {
            data.team1 = colour;
        }
        else {
            data.team2 = colour;
        }
    }

    return data;
}

function getColours(room) {
    const data = colours.filter(colour => colour.room === room);
    return data;
}

function calculateRoundScores(colour1, colour2, room) {
    var score = {room: room};

    if(colour1 == 'red' && colour2 == 'red') {
        score.team1 = 3;
        score.team2 = 3;
    }
    else if(colour1 == 'red' && colour2 == 'blue') {
        score.team1 = 6;
        score.team2 = -6;
    }

    else if(colour1 == 'blue' && colour2 == 'red') {
        score.team1 = -6;
        score.team2 = 6;
    }
    else {
        score.team1 = -3;
        score.team2 = -3;
    }

    return roundScores.push(score);
}

function getRoundScores(room) {
    const data = roundScores.filter(score => score.room === room);
    return data;
}

function isRoundComplete(data) {
    if(data != null && (data.team1 != null && data.team2 != null)) {
        return true;
    }

    return false;
}

function setRoundInProgress(inProgress, room) {
    const index = roundsInProgress.findIndex(round => round.room === room);

    if(index >= 0 && roundsInProgress[index] != null) {
        roundsInProgress[index].inProgress = inProgress;
    }
    else {
        const data = {inProgress: inProgress, room: room};
        roundsInProgress.push(data);
    }

    console.log(JSON.stringify(roundsInProgress));
}

function isRoundInProgress(room) {
    if(roundsInProgress.length > 0) {
        const index = roundsInProgress.findIndex(round => round.room === room);

        if(index >= 0 && roundsInProgress[index] != null) {
            return roundsInProgress[index].inProgress;
        }        
    }
    
    return false;
}

function clearGame(room) {
    const filterColours = colours.filter(colour => colour.room !== room);
    const filterScores = roundScores.filter(score => score.room !== room);
    const filterRoundProgress = roundScores.filter(round => round.room !== room);

    colours = filterColours;
    roundScores = filterScores;
    roundsInProgress = filterRoundProgress;
}

module.exports = {addColour, getColours, calculateRoundScores, getRoundScores, isRoundComplete, setRoundInProgress, isRoundInProgress, clearGame};
