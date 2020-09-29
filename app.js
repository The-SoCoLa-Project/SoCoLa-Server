// =============================================================================
// SERVER SIDE CODE
// =============================================================================

const express = require('express');
const app = express();

// const http = require('http')
// const fs = require('fs')    // file system module
// const path = require('path')
const bodyParser = require('body-parser');

// Since we are calling the API from different locations by hitting endpoints in the browser,
// We also have to install the CORS middleware.
const cors = require('cors')
// const runClingo = require('./child_runClingo.js')

const port = process.env.port || 80
const hostname = 'localhost'

app.listen(port, hostname, () => {
    console.log(`Server is listening at    http://${hostname}:${port}/`)
});

// app.set('view engine', 'css')
// all files inside public are static and available to the frontend
app.use(express.static('public'));
app.use(express.static('views'));   // may need to delete later

// SERVE THE HOMEPAGE (for now not needed since we have only one html file)
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/oldindex.html')
// });

app.use(cors());

// Configuring body parser middleware
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();

// middleware to use for all requests
// we want sth to happen every time a request is sent to our API
router.use(function(req, res, next) {
    // logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test router (accessed at GET http://localhost:80/api)
router.get('/', function(req, res) {
    res.json({message: 'Welcome to the API!'});
    var base = process.env.PWD
    console.log("Path: " + __dirname);
});

//

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// GET call to exec a jar file when a button is clicked
// upon request to the path, do the system call

// on routes that end in /reasoner
// ----------------------------------------------------
router.route('/reasoner')
// (accessed at GET http://localhost:80/api/reasoner)
.get((req, res) => {
    // var childProcess = runClingo();
    var exec = require('child_process').exec, child;
    projectDIR = process.cwd();
    console.log('Starting dir: ' + projectDIR);
    child = exec(`java -jar  ${projectDIR}\\public\\reasoner\\SocReasonerv1_2.jar`, function(error, stdout, stderr) {
        console.log('-------------------\nstdout: \n' + stdout);
        // console.log('-------------------\nstderr: \n' + stderr);
        if(error !== null) {
            console.log('exec error: ' + error);
        }
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

    // This will display each part of the stdout as it happens
    // child.stdout.on('data', (data) => {
    //     console.log(`child __runClingo__ stdout:\n${data}`);
    // });
        
    child.stderr.on('data', (data) => {
        console.error(`child __runClingo__ stderr:\n${data}`);
    });

    res.json({message: 'access to reasoner!'});
    
});



// CHECKING
// on routes that end in /controller
// ----------------------------------------------------
router.route('/controller')
// (accessed at GET http://localhost:80/api/controller)
.get((req, res) => {
    const zmq = require("zeromq");
    async function run() {
        const sock = new zmq.Request;
        sock.connect("tcp://139.91.185.14:5555");
        console.log("Producer bound to port 5555");
        await sock.send("4");
        const [result] = await sock.receive();
        console.log(result);
        // res.json
    }
    run();
    res.json({message: 'connection to controller established, waiting for message'});
});