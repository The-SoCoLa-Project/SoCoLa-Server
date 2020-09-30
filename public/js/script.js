// =============================================================================
// CLIENT SIDE CODE
// =============================================================================

// Onload, convert the .lp input file to text and display it inside component 
function onLoad() {
    var txt = document.getElementById('visionFileText')
    txt.setAttribute('data', '../reasoner/visionInput.lp.txt')
    document.getElementById('interactionMsg').style.visibility = "hidden"
}

// Make a GET request to the server using jquery
const execJar = () => $.get("./api/reasoner/");

// what happens when the Run Reasoner btn is clicked
document.getElementById('runClingo').addEventListener('click', function(e) {
    execJar();
    // first run the jar, then load the file
    var reasonerResult = document.getElementById('reasonerFileText');
    reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.textContent = "Clingo has run successfully!";
    msg.style.color = "#5DA85D"
})

