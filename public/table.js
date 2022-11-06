/**
 * Render the table to display the selected colours and round scores.
 * 
 * @param {number} rows Number of rows
 * @param {rumber} cols Number of columns
 */
function drawGrid(rows, cols) {
    var html = '<tr><th>Round Number</th><th>Team 1 Colour</th><th>Team 1 Points</th><th>Team 2 Colour</th><th>Team 2 Points</th></tr>';
    var tiles = 0;
    const totalTiles = rows * cols - 3;

    //Loop for rows
    for(var i = 0; i < rows; i++) {
        html += "<tr>";

        //Loop for columns
        for(var j = 0; j < cols; j++) {
            if(tiles <= totalTiles) {
                //Determine whether current row is the last
                const isLastRow = (tiles < ((rows - 1) * cols)) ? false : true;

                //Assign an ID to the cell
                html += '<td id="' + tiles + '"';
                
                if(isLastRow) {
                    //Widen the total points cells
                    if(tiles >= totalTiles - 1) {
                        html += ' colspan="2" class="total"';
                    }
                }

                html += '>';
                
                //Display round numbers in the leftmost column
                if(tiles == 0) {
                    html += 'Round 1';
                }
                else if(tiles % cols == 0) {
                    if(isLastRow) {
                        html += 'Total';
                    }
                    else {
                        html += 'Round ' + ((tiles / cols) + 1);
                    }
                }
                
                html += '</td>';
                tiles++;
            }
        }

        html += "</tr>";
    }

    table.html(html);
}

/**
 * Display colour options in the specified cell.
 * 
 * @param {number} tileNo The cell the options will be displayed in
 */
function showColourOptions(tileNo) {
    const tile = $('#' + tileNo);

    var html = '<div class="colour-option red-option" onclick="selectColour(' + tileNo + ',\'red\')"></div>';
    html += '<div class="colour-option blue-option" onclick="selectColour(' + tileNo + ',\'blue\')"></div>';

    //Display message in other team's cell whilst waiting for both teams' decisions
    if(team == 'team1') {
        $('#' + (tileNo + 2)).html('Waiting for other team...');
    }
    else {
        $('#' + (tileNo - 2)).html('Waiting for other team...');
    }

    tile.html(html);
}

/**
 * Runs when a colour option is selected.
 * Fill in the corresponding cell with the selected colour and notify the server of the selection.
 * 
 * @param {number} tileNo The cell to display the selected colour in
 * @param {string} colour The selected colour
 */
function selectColour(tileNo, colour) {
    //Colour the cell with selected colour
    const tile = $('#' + tileNo);
    tile.html('');
    tile.addClass(colour + '-tile');

    //Notify the server
    socket.emit('colour-selected', {
        teamNo: team,
        colour: colour,
        room: roomname
    });
}

/**
 * Display all scores and selected colours up to the current round.
 * 
 * @param {Array<Object>} scores The array of scores for the current room
 * @param {Array<Object>} colours The array of selected colours for the current room
 */
function displayRoundResults(scores, colours) {
    var scoreCellNo = 2;
    var colourCellNo = 1;
    var scoreCell, colourCell;

    for(var i = 0; i < scores.length; i++) {
        //Team 1
        colourCell = $('#' + colourCellNo.toString());
        colourCell.html("");
        colourCell.removeClass().addClass(colours[i].team1 + '-tile');

        scoreCell = $('#' + scoreCellNo.toString());
        scoreCell.html(scores[i].team1.toString());

        //Team 2
        colourCellNo += 2;
        scoreCellNo += 2;

        colourCell = $('#' + colourCellNo.toString());
        colourCell.html("");
        colourCell.removeClass().addClass(colours[i].team2 + '-tile');

        scoreCell = $('#' + scoreCellNo.toString());
        scoreCell.html(scores[i].team2.toString());

        //Next row
        colourCellNo += 3;
        scoreCellNo += 3;
    }
}

/**
 * Add up total scores and display them in the table
 * 
 * @param {Array<Object>} scores The array of scores for the current room
 */
function displayTotalScores(scores) {
    const team1TotalCell = $('#51');
    const team2TotalCell = $('#52');
    var team1Total = 0, team2Total = 0;

    //Add up the scores
    scores.forEach(score => {
        team1Total += score.team1;
        team2Total += score.team2;
    });

    //Display the total scores in the table
    team1TotalCell.html(team1Total.toString());
    team2TotalCell.html(team2Total.toString());
}
