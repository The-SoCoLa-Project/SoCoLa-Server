// =============================================================================
// CLIENT SIDE CODE
// =============================================================================

// Onload, convert the .lp input file to text and display it inside component 
function onLoad() {
    var txt = document.getElementById('inputFileText')
    // var file = new File([""], "../reasoner/reasonerInit.txt");
    // // file reader
    // const reader = new FileReader();
    // reader.readAsText(file);
    // // file reading started
    // reader.addEventListener('loadstart', function() {
	//     console.log('File reading started');
    // });
    // // file reading finished successfully
    // reader.addEventListener('load', function(e) {
    //     txt.setAttribute('data', e.target.result)
    //     var test = document.getElementById('resultsBox')
    //     test.innerText = e.target.result
    // })
    // // file reading failed
	// reader.addEventListener('error', function() {
	//     alert('Error : Failed to read file');
    // });
    txt.setAttribute('data', '../reasoner/visionInput.lp.txt')
    document.getElementById('interactionMsg').style.visibility = "hidden"
}

const func = () => fetch(`https://8f31e086465a.ngrok.io/api/reasoner/`, {method: "GET"});

// what happens when the Run Clingo btn is clicked
document.getElementById('runClingo').addEventListener('click', function(e) {
    //test
    var resultsBox = document.getElementById('resultsBox');
    resultsBox.innerHTML = "run clingo button clicked";

    var outputFile = document.getElementById('outputFileText');
    outputFile.setAttribute('data', '/reasoner/reasonerOutput.txt');
    func();
    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    msg.textContent = "Clingo has run successfully!";
    msg.style.color = "#5DA85D"
})

// what happens when the Edit File btn is clicked
document.getElementById('editFile').addEventListener('click', function(e) {
    //test
    var resultsBox = document.getElementById('resultsBox');
    resultsBox.innerHTML = "edit file button clicked";

    var msg = document.getElementById('interactionMsg');
    msg.style.visibility = "visible";
    // msg.textContent = "Clingo has run successfully!";
    // msg.style.color = "#5DA85D"
})

///////////////////////////////////////////////////////////////////////////////////////////
// lower half - chatbot
//
// what happens when the OK btn in the chatbot area is clicked
document.getElementById('ok').addEventListener('click', function() {
    var inputTxt = document.getElementById('userInput').value
    var reply = document.getElementById('botReply')
    if (inputTxt == "") {
        reply.innerText = "No input!"
    } else {
        reply.innerText = "You told me: " + inputTxt
    }
})