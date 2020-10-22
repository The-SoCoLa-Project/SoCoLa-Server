// =============================================================================
// CLIENT SIDE CODE
// =============================================================================
// here we will just read the files, and load each into a window
var actionHidden    = false;
// added so that we can only change the scenario at the start
// will delete later
var canChangeScenario = true;   
var objCaptured     = false;
var actionCaptured  = false;
var sessionDone     = false;

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
    canChangeScenario = true;
    sessionDone = false;
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
    console.log("child process finished - clingo run successfully!");
});

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
////////////////// jQuery call to the function that updates json file
const updateJson = (filename) => $.get(`./api/controller/parseJson/${filename}`)
.done(function(){
    console.log(`${filename} file updated!`);
});
document.getElementById('captureObj').addEventListener('click', function() {
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";

    //scenario has started, we cannot change it now - will delete later
    canChangeScenario = false;

    if (sessionDone) {
        msg.style.color = "#B17A6F";
        msg.textContent = `Scenario finished. Start new session!`;
    } else {
        if (objCaptured) {
            // alert("The object was already captured for this session!");
            msg.style.color = "#B17A6F";
            msg.textContent = `Object already captured!`;
            if (scenario == 1) {
                msg.textContent += ` Next step: capture the action.`;
            } else {
                msg.textContent += ` Session closed. Start a new one.`
            }
        } else {
            getObjlabels().done(function(){ // after the call to the controller is finished
                var visionFile = document.getElementById('visionFileText');
                var kbFile = document.getElementById('graphGenFileText');
                var reasonerResult = document.getElementById('reasonerFileText');
    
                msg.style.color = "#5DA85D";
                msg.textContent = `Object captured. Step ${step} is done!`;

                // if (scenario == 1) {
                //     // load the file after it has been updated
                //     visionFile.setAttribute('data', '/controller/vision_ObservedLabels.json');
                //     // on the 2nd scenario, we don't receive any inferred labels
                //     kbFile.setAttribute('data', '/controller/kb_InferredLabels.json');
                //     reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                //     msg.textContent += " Now capture the action!";
                // } else if (scenario == 2 && step == 1) {
                //     msg.textContent += ` Do a hidden action and capture object again!`;
                // } else {    // scenario==2 && step==2
                //     reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                //     msg.textContent += " This scenario is finished!";
                //     sessionDone = true;
                // }

                updateJson("jsonIncomingMessage").done(function(){
                    // load the file after it has been updated
                    visionFile.setAttribute('data', '/controller/vision_ObservedLabels.json');
                    if (scenario == 1) {
                        // on the 2nd scenario, we don't receive any inferred labels
                        kbFile.setAttribute('data', '/controller/kb_InferredLabels.json');
                        execJar().done(function(){
                            // first run the jar, then load the file
                            reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                            msg.textContent += " Now capture the action!";
                        });
                    } else if (scenario == 2 && step == 1) {
                        msg.textContent += ` Do a hidden action and capture object again!`;
                    } else {    // scenario==2 && step==2
                        execJar().done(function(){
                            // first run the jar, then load the file
                            reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                            msg.textContent += " This scenario is finished!";
                        });
                        sessionDone = true;
                    }
                });

                // if (scenario == 1) {
                //     // on the 2nd scenario, we don't receive any inferred labels
                //     kbFile.setAttribute('data', '/controller/kb_InferredLabels.json');
                //     // run clingo to get predictions (Scenario 1)
                //     updateJson("jsonIncomingMessage").done(function(){
                //         // load the file after it has been updated
                //         visionFile.setAttribute('data', '/controller/vision_ObservedLabels.json');
                //         // visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.json');
                //         execJar().done(function(){
                //             // first run the jar, then load the file
                //             reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                //             msg.textContent += " Now capture the action!";
                //         });
                //     });
                // } else if (scenario == 2 && step == 1) {
                //     updateJson("jsonIncomingMessage").done(function(){
                //         visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.json');
                //         msg.textContent += ` Do a hidden action and capture object again!`;
                //     });
                // } else  {  // scenario==2 && step==2
                //     // run clingo to get action sequence (Scenario 2)
                //     updateJson("jsonIncomingMessage").done(function(){
                //         // load the file after it has been updated
                //         visionFile.setAttribute('data', '/controller/vision_ObservedLabels.json');
                //         // visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.json');
                //         execJar().done(function(){
                //             // first run the jar, then load the file
                //             reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                //             msg.textContent += " This scenario is finished!";
                //         });
                //     });
                //     sessionDone = true;
                // }
    
                // we are done with capturing objects for this session
                if (scenario == 1 || (scenario == 2 && step == 2)) {
                    objCaptured = true;
                } 
                step++;
                // visionFile.setAttribute('data', '/controller/vision_ObservedLabels.txt');
            });
        }
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
    var msg = document.getElementById('interactionMsg');
    var visionFile = document.getElementById('visionFileText');
    var kbFile = document.getElementById('graphGenFileText');
    var reasonerResult = document.getElementById('reasonerFileText');

    msg.style.visibility = "visible";
    
    if (sessionDone) {
        msg.style.color = "#B17A6F";
        msg.textContent = `Scenario finished. Start new session!`;
    } else {
        // we need to capture the object before capturing the action
        if (!objCaptured) {
            msg.style.color = "#B17A6F";
            msg.textContent = `Need to capture the object before the action!`;
        } else {
            // no need to check for 2nd scenario because this btn will be disabled
            if (actionCaptured) {
                msg.style.color = "#B17A6F";
                msg.textContent = `Action already captured!`;
            } else {
                getActionLabels()
                // first do this after call to api
                .then(function(){
                    visionFile.setAttribute('data', '/controller/vision_ObservedLabels.json');
                    // kbFile.setAttribute('data', '/controller/kb_InferredLabels.txt');
                    // visionFile.setAttribute('data', '/reasoner/jsonIncomingMessage.json');
                    msg.style.visibility = "visible";
                    msg.style.color = "#5DA85D";
                    msg.textContent = `Action captured! Step ${step} is done!`;
                    actionCaptured = true;
                })
                // update json file with step, scenario and sessionID
                .done (function(){
                    // and at last run clingo (Scenario 1)
                    updateJson("jsonIncomingMessage").done(function(){
                        execJar().done(function(){
                            // first run the jar, then load the file
                            reasonerResult.setAttribute('data', '/reasoner/reasonerOutput.txt');
                            msg.textContent += " Clingo run successfully! Scenario finished!";
                            sessionDone = true;
                        });
                    });
                });
            }
        }
    }
})


////////////////// what happens when the Hidden Action btn is clicked
// toggle button -> states active & non active
document.getElementById('hiddenAction').addEventListener('click', function() {    
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.style.color = "#5DA85D";

    if (!canChangeScenario) { // will be deleted later
        msg.style.color = "#B17A6F";
        msg.textContent = "Cannot change action state mid-scenario. You need to start a new session.";
    } else {
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
    }
})

////////////////// what happens when the New Session btn is clicked
// refresh the page and a the session will regenerate -> new session
document.getElementById("refresh").addEventListener('click', function() {
    var winRefresh = confirm("Do you want to start a new session?");
    if (winRefresh) {
        window.location.reload();
    }     
})
