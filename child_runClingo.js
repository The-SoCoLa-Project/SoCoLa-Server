module.exports = function() {
    var exec = require('child_process').exec, child;
    var returnStr = "ERROR";
    child = exec('clingo  .\\public\\reasoner\\visionInput.lp 0 > .\\public\\reasoner\\reasonerOutput.txt', function(error, stdout, stderr) {
        // console.log('-------------------\nstdout: \n' + stdout);
        // console.log('-------------------\nstderr: \n' + stderr);
        if(error !== null) {
            console.log('exec error: ' + error);
        }
        // returnStr = stdout;
        // console.log('INSIDE returnStr?\n' + returnStr)
        // return returnStr;
    });

    // add an event listener for the error event so that all errors are handled
    // If an error is not handled, the node process will crash and exit
    child.on('error', (err) => {
        console.log(err)
    });

    // handler for the exit event
    // signal var is null when the child exits normally
    child.on('exit', function (code, signal) {
        console.log('Child process __runClingo__ exited with ' +
                    `code ${code} and signal ${signal}`);
    });

    child.on('close', () => {
        console.log('child stream __runClingo__ closed.')
    });

    child.stdout.on('data', (data) => {
        console.log(`child __runClingo__ stdout:\n${data}`);
    });
      
    child.stderr.on('data', (data) => {
        console.error(`child __runClingo__ stderr:\n${data}`);
    });
}

