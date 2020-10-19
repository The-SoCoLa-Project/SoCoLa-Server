// =============================================================================
// SERVER SIDE CODE
// =============================================================================
const express   = require('express');
const app       = express();
const path      = require('path');

const fs        = require('fs');    // file system module
const readline  = require('readline');
const bodyParser= require('body-parser');
const zmq       = require("zeromq");
const session   = require('express-session'); // cookie-based session management
// const uuid      = require('uuid'); // generate random strings
const stringify = require('json-stringify-pretty-compact');

const port = process.env.port || 443;
const hostname = '139.91.183.118';

var scenario, step;

app.listen(port, hostname, () => {
    console.log(`Server is listening at    http://${hostname}:${port}/`)
});

// =============================================================================
// CONFIGURE SESSION AND COOKIES
// =============================================================================
//// To store or acces session data, simply use the request property req.session
//
// secure: true -> recommended but requires https-enabled website
// HTTPS is necessary for secure cookies
// If secure==true, and site access over HTTP -> cookie not set
// If nodejs behind a proxy and secure==true -> set trust proxy
app.set('trust proxy', 1);  // trust first proxy
app.use(session({
    secret: 'keyboardcat',
    // genid: function(req) {
    //     return uuid();  // use UUIDs for session IDs
    // },
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true 
    }
}));

// clear the entire session and start a new one
function newSession(req) {
    console.log("Session regen about to happen.....");
    req.session.regenerate(function(err) {
        if (err) console.error("Couldn't regenerate session!"); 
        else console.log("SessionID: ",req.sessionID);
    });
}
// END OF CONFIGURE SESSION
// =============================================================================

// app.set('view engine', 'css')
// all files inside public are static and available to the frontend
app.use(express.static('public'));
// app.use(express.static('views'));   // may need to delete later

app.get('/', (req, res) => {
    console.log("/-/-/ Page Refreshed /-/-/");
    newSession(req);
    res.sendFile(path.join(__dirname+"/views/index.html"));

    // clear the files because inside session we append
    // fs.writeFile(`./public/controller/vision_ObservedLabels.json`,"", function(err) {
    // fs.writeFile(`./public/reasoner/vision_ObservedLabels.json`,"", function(err) {
    //     if (err) console.error(err + ": Couldn't clear file vision_ObservedLabels.json");
    // });
    // fs.writeFile(`./public/controller/kb_InferredLabels.json`,"", function(err) {
    // fs.writeFile(`./public/reasoner/kb_InferredLabels.json`,"", function(err) {
    //     if (err) console.error(err + ": Couldn't clear file kb_InferredLabels.json");
    // });
});

// Configuring body parser middleware
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Since we are calling the API from different locations by hitting endpoints in the browser,
// We also have to install the CORS middleware.
const cors = require('cors');
// const { query } = require('express');
app.use(cors({origin: "http://139.91.183.118:443"}));
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

// test router (accessed at GET http://139.91.183.118:443/api)
router.get('/', function(req, res) {
    // test session
    // everytime the server is restarted, the sessionID changes
    console.log("---> API CALL\t",req.session.id);
    res.write(`<h1>Welcome to the API!</h1>`);
    res.write(`<h3>SessionID: ${req.sessionID}</h3>`);
    res.end();
});

//

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


///////////////////////////////////////////////////////////////////
//// EXECUTING REASONER
///////////////////////////////////////////////////////////////////
// GET call to exec a jar file when a button is clicked
// upon request to the path, do the system call
function runClingo(req, res) {
    var exec = require('child_process').exec, child;
    var shellCode = `java -jar .\\SocReasonerv1_3.jar`;
    console.log("JAR: ",shellCode)

    res.write(`Access to reasoner...\n`);
    child = exec(shellCode, {cwd:".\\public\\reasoner"}, function(error, stdout, stderr) {
        // console.log('-------------------\nstdout: \n' + stdout);
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

    console.log("---> REASONER CALL\t", req.sessionID);
    res.write(`sessionID:${req.sessionID}\n`);
    res.end();
}

// on routes that end in /reasoner
// ----------------------------------------------------
router.route('/reasoner')
// (accessed at post http://139.91.183.118:443/api/reasoner)
.get((req, res) => {
    runClingo(req,res);
});



// CHECKING
// on routes that end in /controller
// used just for testing the zmq lib
// ----------------------------------------------------
router.route('/controller')
// (accessed at GET http://localhost:80/api/controller)
.get((req, res) => {
    speakWithController(req);
    
    res.json({message: `connection with controller established      sessionID: ${req.sessionID}`});
});

///////////////////////////////////////////////////////////////////
//// CONNECTION TO CONTROLLER
///////////////////////////////////////////////////////////////////
function speakWithController(req) {
    
    function askForOption(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }

    const puller = new zmq.Pull;
    puller.connect("tcp://139.91.185.14:5556");

    const pusher = new zmq.Push;
    // NEED THE * TO BYPASS THE WINDOWS FIREWALL!
    pusher.bind("tcp://*:5566");
    console.log("Producer bound to port 5556");

    // send messages
    async function thread1() {
        while(true){
            try{
                const option = await askForOption("Select option (Numbers 1 to 3): ");
                let rawdata = fs.readFileSync(`json_UI_example_${option}.json`);
                let json_msg = JSON.parse(rawdata)
                json_msg['SessionId']=req.sessionID;
         
                await pusher.send(JSON.stringify(json_msg));
            } catch(e) { console.error(e); }
        }
    }

    // receive messages
    async function thread2() {
        while(true){
            try{
                const [raw_msg]=await puller.receive(); 
                json_msg = JSON.parse(raw_msg);

                if(json_msg["Source"].includes("Vision")){
                    console.log("Observer Labels:");
                    writeFile("vision_ObservedLabels",json_msg.Message, req.sessionID,true);
                    console.log(json_msg);
                }
        
                if(json_msg["Source"].includes("KB")){
                    console.log("Inferred Labels:");
                    writeFile("kb_InferredLabels", json_msg.Message, req.sessionID,true);
                    console.log(json_msg);
                }  
            } catch(e) { console.error(e); }
        }
    }

    thread1();
    thread2();

}



///////////// Tell controller to return object labels and add some params needed to controller
//// query params:  scenario,   step
// --------------------------------------------------------------------------------------------
router.route('/controller/getObjLabels')
// (accessed at GET http://localhost:80/api/controller/getObjLabels?scenario=2&step=2)
.get((req, res) => {
    scenario = req.query.scenario;
    step = req.query.step;

    res.send("Scenario: " + scenario + "\t" + "Step: " + step);
    console.log("------------Confirming correct params------------")
    console.log("GET call to: " + req.path);
    console.log("Scenario: " + scenario + "\t" + "Step: " + step);

    // TODO: add messaging to controller

});

///////////// Tell controller to return action labels and add some params needed to controller
//// query params:  scenario,   step
// --------------------------------------------------------------------------------------------
router.route('/controller/getActionLabels')
// (accessed at GET http://localhost:80/api/controller/getActionLabels?scenario=INT&step=INT)
.get((req, res) => {
    scenario = req.query.scenario;
    step = req.query.step;

    res.send("Scenario: " + scenario + "\t" + "Step: " + step);
    console.log("------------Confirming correct params------------");
    console.log("GET call to: " + req.path);
    console.log("Scenario: " + scenario + "\t" + "Step: " + step);

    // TODO: add messaging to controller
    
});

function writeFile(fileName, text, sessionID, appendFile) {
    if (appendFile) {
        fs.appendFileSync(`./public/reasoner/${fileName}.json`,stringify(text,null,2));
    } else {
        // read json file and update scenario, step and sessionid
        let rawdata = fs.readFileSync(`./public/reasoner/${fileName}.json`);
        let controller = JSON.parse(rawdata);
        console.log(controller);
        // update sessionID
        controller.SessionId = sessionID;

        // add Scenario and Step tags at the start of the json file
        if (controller.Scenario) controller.Scenario = scenario;
        if (controller.Step) controller.Step = step;
        var addToJson = {"Scenario": scenario,"Step": step};
        var newJson = Object.assign(addToJson, controller)
        console.log("new json: ",newJson);

        fs.writeFileSync(`./public/reasoner/${fileName}.json`,stringify(newJson,null,2));
    }

    // now copy json to txt file (only needed for the jsonIncomingMessage file)
    fs.copyFile(`./public/reasoner/${fileName}.json`, 
                `./public/reasoner/${fileName}.txt`, (err) => {
        if (err) throw err;
        console.log(`${fileName}.json was copied to ${fileName}.txt`);
    });
}

///////////// To be called to update file with sessionID, scenario and step
router.route('/controller/parseJson/:fileName')
// (accessed at GET http://localhost:80/api/controller/parseJson)
.get((req, res) => {
    // test session 
    console.log("req sessionID: ",req.sessionID);

    writeFile(req.params.fileName, "", req.sessionID, false);   // true for append

    res.json({message: `done parsing json. sessionid: ${req.sessionID}`});
});
