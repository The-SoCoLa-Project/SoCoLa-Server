// =============================================================================
// SERVER SIDE CODE
// =============================================================================
const express = require('express');
const app = express();

const fs = require('fs');    // file system module
const bodyParser = require('body-parser');
const zmq = require("zeromq");

const port = process.env.port || 80
const hostname = 'localhost'

var sessionID = 0;

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

// Configuring body parser middleware
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Since we are calling the API from different locations by hitting endpoints in the browser,
// We also have to install the CORS middleware.
const cors = require('cors')
app.use(cors({origin: "http://localhost:80"}));
// =============================================================================
// ADD HEADERS - we don't need this because of using cors
// =============================================================================
// app.use(function(req,res,next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', "http://localhost:80");
//     // Request methods you wish to allow
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, FETCH");
//     // Request headers to allow
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
//     // Set to true if you need the website to include cookies in the request 
//     // sent to the API (eg. in case of using sessions)
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     // Pass to next layer of middleware
//     next();
// });


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
// (accessed at post http://localhost:80/api/reasoner)
.get((req, res) => {
    var exec = require('child_process').exec, child;
    var shellCode = `java -jar .\\SocReasonerv1_3.jar`;
    console.log("JAR: ",shellCode)
    child = exec(shellCode, {cwd:".\\public\\reasoner"}, function(error, stdout, stderr) {
        console.log('-------------------\nstdout: \n' + stdout);
        console.log('-------------------\nstderr: \n' + stderr);
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
    // child.stderr.on('data', (data) => {
    //     console.error(`child __runClingo__ stderr:\n${data}`);
    // });

    res.json({message: 'access to reasoner!'});
    
});



// CHECKING
// on routes that end in /controller
// ----------------------------------------------------
router.route('/controller')
// (accessed at GET http://localhost:80/api/controller)
.get((req, res) => {
    var print = "";
    async function run() {
        try{
            const sock = new zmq.Reply;
            await sock.bind("tcp://*:5556");
            console.log("Producer bound to port 5556");
            var [result] = await sock.receive();
            var controllerReply=JSON.parse(result); 
            console.log("Before init msg ",controllerReply);
            var jsonInitMessage= {
                'Sender': "UI",
                'Source': "-",
                'Component': "-",
                'SessionId': "-",
                'Message': "Hello",
            };
            var jsonInit=JSON.stringify(jsonInitMessage);
            // both send() and receive() are blocking (by default)
            await sock.send(jsonInit);
            [result] = await sock.receive();
            // var rawStr = result.toString("utf-8");
            controllerReply=JSON.parse(result);
            console.log("After 2nd receive ",controllerReply);


            // save the received text into a file
            // fs.writeFile('./public/reasoner/jsonIncomingMessage.json', print, function(err) {
            //     if (err) return console.error(err);
            //     console.log('json text received > jsonIncomingMessage.txt');
            // });

        } catch(e) {
            console.error(e);
        }
        res.json({message: "connection with controller established"});

        // console.log('Received ',print);
        // res.json({message: print});
        
    }
    run();
});


function getCurSessionID() {
    return sessionID;
};


///////// FOR TESTING PURPOSES - TO BE INTEGRATED ABOVE
router.route('/controller/parseJson')
// (accessed at GET http://localhost:80/api/controller/parseJson)
.get((req, res) => {
    // test function 
    var curSession = getCurSessionID();
    console.log("Current SessionID: ",curSession);


    // this can only work once - require is synchronous, the calls receive a cached result
    // if the file is updated, it cannot be re-read
    // var jsonVision = require('./public/reasoner/jsonTest.json');

    // read json file, change a value and then re-write it
    let rawdata = fs.readFileSync('./public/reasoner/jsonTest.json');
    let controller = JSON.parse(rawdata);
    console.log(controller);
    console.log("previous sessionid: ",controller.SessionId);

    // add Scenario and Step tags at the start of the json file
    var addToJson = {"Scenario":2,"Step":2};
    var newJson = Object.assign(addToJson, controller)
    console.log("new json: ",newJson);
    fs.writeFileSync('./public/reasoner/jsonTest.json',JSON.stringify(newJson,null,"\t"));

    console.log("after the fs.readFileSync")
    res.json({message: "done parsing json"});
});
