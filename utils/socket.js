const {addTeam, removeTeam, getRoomTeams, isTeamConnected} = require('./teams');
const {addColour, getColours, calculateRoundScores, isRoundComplete, getRoundScores, setRoundInProgress, isRoundInProgress, clearGame} = require('./score');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log('socket.io connection successful');

        //Listen for client connecting to the server
        socket.on('joined-team', ({teamNo, room}) => {
            //Add client to the list of connected clients
            if(teamNo == 'obs' || !isTeamConnected(teamNo, room)) {
                if(teamNo != 'obs') {
                    addTeam(socket.id, teamNo, room);
                }

                //Connect client to the specified room
                socket.join(room);

                //Alert other clients in the room that another team has joined
                io.to(room).emit('online-teams', {
                    room: room,
                    teams: getRoomTeams(room),
                    scores: getRoundScores(room),
                    colours: getColours(room),
                    inProgress: isRoundInProgress(room)
                });
            }
        });

        //Listen for client disconnecting from the server
        socket.on('disconnect', () => {
            //Remove client from the list of connected clients
            const team = removeTeam(socket.id);

            if(team) {
                //Determine which room client was connected to
                const teams = getRoomTeams(team.room);

                //Alert other clients in the room of the disconnecting client
                io.to(team.room).emit('online-teams', {
                    room: team.room,
                    teams: teams,
                    inProgress: isRoundInProgress(team.room)
                });

                //Clear game data if all clients disconnect
                if(teams.length == 0) {
                    clearGame(team.room);
                }
            }
        });

        //Listen for team selecting a colour
        socket.on('colour-selected', ({teamNo, colour, room}) => {
            //Store colour choice on the server
            const addedColour = addColour(teamNo, colour, room);

            //Determine whether both teams have selected a colour
            if(isRoundComplete(addedColour)) {
                //Calculate the scores after colours have been selected
                setRoundInProgress(false, room);
                calculateRoundScores(addedColour.team1, addedColour.team2, room);

                const scores = getRoundScores(room);
                const colours = getColours(room);

                //Alert clients that the round is over and send the updated scores
                io.to(room).emit('round-complete', {
                    room: room,
                    scores: scores,
                    colours: colours
                });
            }
        });

        //Listen for 'start' instruction from facilitator
        socket.on('start-round', ({room}) => {
            //Acknowledge a round has begun in the specified room
            setRoundInProgress(true, room);

            //Alert teams that the round has begun
            io.to(room).emit('start-round', {
                room: room
            });
        });

        //Listen for the end of the game (round 10 has passed)
        socket.on('game-over', ({room}) => {
            //Clear the game scores for the room
            clearGame(room);
            console.log('game over: ' + JSON.stringify(getRoundScores(room)));
        });
    });
}

module.exports = socket;