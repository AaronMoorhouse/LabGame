const overlay = $("#overlay");

//Hide dialog when surrounding overlay is clicked
overlay.click(function(e) {
    if(e.target == this) {
        hideDialog();
    }
})

/**
 * Display a modal dialog box.
 */
function showDialog() {
    overlay.css('display', 'block');
}

/**
 * Hide the dialog box.
 */
function hideDialog() {
    overlay.css('display', 'none');
}