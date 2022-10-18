const {addTeam, removeTeam, getRoomTeams, isTeamConnected} = require('./teams');
const {addColour, getColours, calculateRoundScores, isRoundComplete, getRoundScores, setRoundInProgress, isRoundInProgress, clearGame} = require('./score');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log('socket.io connection successful');

        socket.on('joined-team', ({teamNo, room}) => {
            if(teamNo == 'obs' || !isTeamConnected(teamNo, room)) {
                if(teamNo != 'obs') {
                    addTeam(socket.id, teamNo, room);
                }

                socket.join(room);

                io.to(room).emit('online-teams', {
                    room: room,
                    teams: getRoomTeams(room),
                    scores: getRoundScores(room),
                    colours: getColours(room),
                    inProgress: isRoundInProgress()
                });
            }
        });

        socket.on('disconnect', () => {
            const team = removeTeam(socket.id);

            if(team) {
                const teams = getRoomTeams(team.room);

                io.to(team.room).emit('online-teams', {
                    room: team.room,
                    teams: teams
                });

                if(teams.length == 0) {
                    clearGame(team.room);
                }
            }
        });

        socket.on('colour-selected', ({teamNo, colour, room}) => {
            const addedColour = addColour(teamNo, colour, room);
            console.log('colours: '+JSON.stringify(getColours(room)));

            if(isRoundComplete(addedColour)) {
                setRoundInProgress(false);
                calculateRoundScores(addedColour.team1, addedColour.team2, room);

                const scores = getRoundScores(room);
                const colours = getColours(room);
                console.log('scores: '+JSON.stringify(scores));

                io.to(room).emit('round-complete', {
                    room: room,
                    scores: scores,
                    colours: colours
                });
            }
        });

        socket.on('start-round', ({room}) => {
            setRoundInProgress(true);

            io.to(room).emit('start-round', {
                room: room
            });
        });

        socket.on('game-over', ({room}) => {
            clearGame(room);
            console.log('game over: ' + JSON.stringify(getRoundScores(room)));
        });
    });
}

module.exports = socket;