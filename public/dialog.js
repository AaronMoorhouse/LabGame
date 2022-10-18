const overlay = $('#overlay');
const content = $('#dialog-content');
const header = $('#dialog-header');

function showDialog(round) {
    var html = '';

    if(team == 'fac') {
        html = '<p>Press \'Start\' to begin the round...</p>';
        html += '<button id="start-button" class="button">Start</button>';
    }
    else {
        html = '<p>Waiting for facilitator to start the round...</p>';
    }

    content.html(html);
    header.html('<p>ROUND ' + round + '</p>');
    overlay.css('display', 'block');
}

function hideDialog() {
    overlay.css('display', 'none');
}