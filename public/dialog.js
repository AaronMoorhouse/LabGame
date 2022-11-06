//Template elements
const overlay = $('#overlay');
const content = $('#dialog-content');
const header = $('#dialog-header');

/**
 * Display the dialog box on screen to allow the facilitator to begin the round and inform teams they are waiting on the facilitator.
 * Also displays the colour selections of both teams from the previous round.
 * 
 * @param {Array<Object>} colours The array of colour objects containing the selected colours for the current room
 */
function showDialog(colours) {
    var html = '';

    //Determine the colours picked by the teams in the previous round
    if(roundNo > 1) {
        if(colours != null && colours.length > 0) {
            const i = colours.length - 1;
            const colour1 = colours[i].team1;
            const colour2 = colours[i].team2;

            html += '<p>Team 1 picked <span class="dialog-colour" style="color:' + colour1 + '">' + colour1 + '</span>!';
            html += '</br>Team 2 picked <span class="dialog-colour" style="color:' + colour2 + '">' + colour2 + '</span>!';
        }

        header.html('<p>ROUND ' + (roundNo - 1) + '</p>');
    }
    else {
        header.html('<p>ROUND ' + roundNo + '</p>');
    }

    //Display 'start' button for facilitator and 'waiting' text for teams
    if(team == 'fac') {
        html += '<p>Press \'Start\' to begin round ';
        html += (roundNo > 1) ? roundNo : '1';
        html += '...';
        html += '</p><button id="start-button" class="button">Start</button>';
    }
    else {
        html += '<p>Waiting for facilitator to start round ';
        html += (roundNo > 1) ? roundNo : '1';
        html += '...</p>';
    }

    //Add HTML content to dialog and display dialog on screen
    content.html(html);
    overlay.css('display', 'block');
}

/**
 * Remove the dialog box from the screen.
 */
function hideDialog() {
    overlay.css('display', 'none');
}