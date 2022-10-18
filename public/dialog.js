const overlay = $('#overlay');
const content = $('#dialog-content');
const header = $('#dialog-header');

function showDialog() {
    var html = '';
    console.log(roundNo);

    if(roundNo > 1) {
        header.html('<p>ROUND ' + (roundNo - 1) + '</p>');
        html += '<p>Team 1 picked (colour)!</br>Team 2 picked (colour)!';
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