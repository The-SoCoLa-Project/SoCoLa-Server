// =============================================================================
// CLIENT SIDE CODE
// =============================================================================
// here we will just read the files, and load each into a window
var actionHidden    = false;
var objCaptured     = false;
var actionCaptured  = false;

var scenario = 0;
var step = 0;

// Onload, convert the .lp input file to text and display it inside component 
function onLoad() {
    // var txt = document.getElementById('visionFileText')
    // txt.setAttribute('data', '../reasoner/json_format1_example.json')
    document.getElementById('interactionMsg').style.visibility = "hidden"
    // Initialize scenario and step
    if (actionHidden)   scenario = 2;
    else                scenario = 1; 
    step = 1;
    console.log("OnLoad:\nScenario: " + scenario + "\t" + "Step: " + step);
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
const getObjlabels = () => $.get(`./api/controller/getObjLabels?scenario=${scenario}&step=${step}`)
.done(function(){
    console.log("Scenario: " + scenario + "\t" + "Step: " + step);
    console.log("Object Labels received!");
});
document.getElementById('captureObj').addEventListener('click', function() {
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";

    if (objCaptured) {
        // alert("The object was already captured for this session!");
        msg.style.color = "#B17A6F";
        msg.textContent = `The object was already captured!`;
        if (scenario == 1) {
            msg.textContent += ` Your next step is to capture the action.`;
        } else {
            msg.textContent += ` Session closed. Start a new one.`
        }
    } else {
        getObjlabels().done(function(){ // after the call to the controller is finished
            var visionFile = document.getElementById('visionFileText');
            visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.txt');

            msg.style.color = "#5DA85D";
            msg.textContent = `The object has been captured. Step ${step} is done!`;
            if (scenario == 1) {
                msg.textContent += ` Now capture the action!`;
            } else {
                msg.textContent += ` This scenario is finished!`;
            }

            // we are done with capturing objects for this session
            if (scenario == 1 || (scenario == 2 && step == 2))  objCaptured = true;
            step++;
        });
    }
})

////////////////// what happens when the Capture Action btn is clicked
// STEPS TO TAKE:
// open socket to speak with controller. receive:
// - json with labels from vision (Source: Vision) -> display into vision window
// - json with inferred labels from kg (Source: Knowledge Graph) -> into kg window
// - save the labels from vision into a file (to be used by reasoner)
const getActionLabels = () => $.get(`./api/controller/getActionLabels?scenario=${scenario}&step=${step}`)
.done(function(){
    console.log("Scenario: " + scenario + "\t" + "Step: " + step);
    console.log("Action Labels received!");
});
document.getElementById('captureAction').addEventListener('click', function() {
    if (actionCaptured) {
        // alert("The object was already captured for this session!");
        msg.style.color = "#B17A6F";
        msg.textContent = `The object was already captured!`;
        if (scenario == 1) {
            msg.textContent += ` Your next step is to capture the action.`;
        } else {
            msg.textContent += ` Session closed. Start a new one.`
        }
    } else {
        getActionLabels().done(function(){
            var visionFile = document.getElementById('visionFileText');
            visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.txt');

            var msg = document.getElementById('interactionMsg');
            msg.style.visibility = "visible";
            msg.style.color = "#5DA85D";
            msg.textContent = `The action has been captured! Step ${step} is done!`;
            actionCaptured = true;
        });
    }
})

////////////////// what happens when the Hidden Action btn is clicked
// toggle button -> states active & non active
document.getElementById('hiddenAction').addEventListener('click', function() {
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.style.color = "#5DA85D"

    var captActionBtn = document.getElementById('captureAction');
    // when we choose to hide action (scenario 2), make the btn CaptureAction inactive
    if (actionHidden == true) {
        this.style.backgroundColor = "#7f8c8d";
        this.innerText = "Do Hidden Action";
        msg.textContent = "The action will be seen!";
        actionHidden = false;
        captActionBtn.disabled = false;
        scenario = 1;
    } else {
        this.style.backgroundColor = "#537596";
        this.innerText = "Do Visible Action";
        msg.textContent = "The action will be hidden!";
        actionHidden = true;
        captActionBtn.disabled = true;
        scenario = 2;
    }
})