const teams = [];

function addTeam(id, teamNo, room) {
    const teamData = {id, teamNo, room};
    teams.push(teamData);

    return teamData;
}

function removeTeam(id) {
    const index = teams.findIndex(team => team.id === id);
    
    if(index >= 0) {
        return teams.splice(index, 1)[0];
    }
}

function getRoomTeams(room) {
    const data = teams.filter(team => team.room === room);
    return data;
}

function isTeamConnected(teamNo, room) {
    const roomTeams = getRoomTeams(room);
    var isConnected = false;

    roomTeams.forEach(team => {
        if(team.teamNo == teamNo) {
            isConnected = true;
        }
    });

    return isConnected;
}

module.exports = {addTeam, removeTeam, getRoomTeams, isTeamConnected};