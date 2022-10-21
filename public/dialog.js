const overlay = $('#overlay');
const content = $('#dialog-content');
const header = $('#dialog-header');

function showDialog(colours) {
    var html = '';

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

    content.html(html);
    overlay.css('display', 'block');
}

function hideDialog() {
    overlay.css('display', 'none');
}