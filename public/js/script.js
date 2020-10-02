// =============================================================================
// CLIENT SIDE CODE
// =============================================================================
var actionHidden    = false;
var objCaptured     = false;
var actionCaptured  = false;

// Onload, convert the .lp input file to text and display it inside component 
function onLoad() {
    // var txt = document.getElementById('visionFileText')
    // txt.setAttribute('data', '../reasoner/json_format1_example.json')
    document.getElementById('interactionMsg').style.visibility = "hidden"
}

////////////////// what happens when the Run Reasoner btn is clicked
// Make a GET request to the server using jquery
// use the done method to make the client wait for the child process to finish
// before loading the result
const execJar = () => $.get("./api/reasoner/")
.fail(function(){
    console.error("jQuery GET, failed to get reasoner");
})
.done(function(){
    console.log("child process finished");
});
document.getElementById('runClingo').addEventListener('click', function() {
    execJar().done(function(){
        // first run the jar, then load the file
        var reasonerResult = document.getElementById('reasonerFileText');
        reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
        var msg = document.getElementById('interactionMsg');
        msg.style.visibility = "visible";
        msg.style.color = "#5DA85D";
        msg.textContent = "Clingo has run successfully!";
    });
})

////////////////// what happens when the Capture Obj btn is clicked
// STEPS TO TAKE:
// open socket to speak with controller. receive:
// - json with labels from vision (Source: Vision) -> display into vision window
// - json with inferred labels from kg (Source: Knowledge Graph) -> into kg window
// - save the labels from vision into a file (to be used by reasoner)
const getObjlabels = () => $.get("./api/controller/").done(function(){
    console.log("Object Labels received!");
});
document.getElementById('captureObj').addEventListener('click', function() {
    getObjlabels().done(function(){
        var visionFile = document.getElementById('visionFileText');
        visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.json');

        var msg = document.getElementById('interactionMsg');
        msg.style.visibility = "visible";
        msg.style.color = "#5DA85D";
        msg.textContent = "The object has been captured!";
        objCaptured = true;
    });
})

////////////////// what happens when the Capture Action btn is clicked
// STEPS TO TAKE:
// open socket to speak with controller. receive:
// - json with labels from vision (Source: Vision) -> display into vision window
// - json with inferred labels from kg (Source: Knowledge Graph) -> into kg window
// - save the labels from vision into a file (to be used by reasoner)
document.getElementById('captureAction').addEventListener('click', function() {
    var visionFile = document.getElementById('visionFileText');
    visionFile.setAttribute('data', '/reasoner/visionInput.lp.txt');

    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.style.color = "#5DA85D";
    msg.textContent = "TODO: action captured!";
    actionCaptured = true;
})

////////////////// what happens when the Hidden Action btn is clicked
// 
document.getElementById('hiddenAction').addEventListener('click', function() {
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.style.color = "#5DA85D"
    if (actionHidden == true) {
        msg.textContent = "The action will be seen!";
        actionHidden = false;
    } else {
        msg.textContent = "The action will be hidden!";
        actionHidden = true;
    }
})