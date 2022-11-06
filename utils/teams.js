//Array containing all clients currently connected to the server
const teams = [];

/**
 * Add a client to the list of connected clients.
 * 
 * @param {int} id Socket ID of the connected client
 * @param {string} teamNo Team/facilitator connected to the room
 * @param {string} room The room the client is connected to
 * 
 * @returns {Object} The client object containing the socket ID, role and room name
 */
function addTeam(id, teamNo, room) {
    //Create client object and add to the array
    const teamData = {id, teamNo, room};
    teams.push(teamData);

    return teamData;
}

/**
 * Remove a client from the list of connected clients.
 * 
 * @param {int} id Socket ID of the connected client
 * 
 * @returns {Object} The removed client object containing the socket ID, role and room name
 */
function removeTeam(id) {
    //Determine index of the disconnected client
    const index = teams.findIndex(team => team.id === id);
    
    //Remove the client object from the array
    if(index >= 0) {
        return teams.splice(index, 1)[0];
    }
}

/**
 * Retrieve a list of connected clients to a specified room.
 * 
 * @param {string} room The name of the room to get connected clients of
 * 
 * @returns {Array<Object>} Array containing all connected clients to the specified room
 */
function getRoomTeams(room) {
    //Filter array of all clients, leaving only the clients connected to the room
    const data = teams.filter(team => team.room === room);
    return data;
}

/**
 * Check whether a certain team/facilitator is connected to a specified room.
 * 
 * @param {string} teamNo The team/facilitator being checked for
 * @param {string} room The room to check for the specified team/facilitator
 * 
 * @returns {boolean} True if the specified team/facilitator is connected to the specified room
 */
function isTeamConnected(teamNo, room) {
    //Get list of clients connected to the room
    const roomTeams = getRoomTeams(room);
    var isConnected = false;

    //Check if specified client is in the list
    roomTeams.forEach(team => {
        if(team.teamNo == teamNo) {
            isConnected = true;
        }
    });

    return isConnected;
}

module.exports = {addTeam, removeTeam, getRoomTeams, isTeamConnected};