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
    txt.setAttribute('data', 'info.txt')
}

// what happens when the Run Jar btn is clicked
document.getElementById('runJar').addEventListener('click', function() {
    //test
    var resultsBox = document.getElementById('resultsBox');
    resultsBox.innerHTML = "asdfawggeeesdgsssaa";
    var outputFile = document.getElementById('outputFileText');
    outputFile.setAttribute('data', '/reasoner/reasonerOutput.txt');
})


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