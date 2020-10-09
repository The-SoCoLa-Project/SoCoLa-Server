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

const port = process.env.port || 80
const hostname = 'localhost'

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
});

// Configuring body parser middleware
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Since we are calling the API from different locations by hitting endpoints in the browser,
// We also have to install the CORS middleware.
const cors = require('cors');
// const { query } = require('express');
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

    res.write(`Access to reasoner...\n`);
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

    console.log("---> REASONER CALL\t", req.sessionID);
    res.write(`sessionID:${req.sessionID}\n`);
    res.end();
});



// CHECKING
// on routes that end in /controller
// used just for testing the zmq lib
// ----------------------------------------------------
router.route('/controller')
// (accessed at GET http://localhost:80/api/controller)
.get((req, res) => {
    // var print = "";
    // async function run() {
    //     try{
    //         const sock = new zmq.Reply;
    //         await sock.bind("tcp://*:5556");
    //         console.log("Producer bound to port 5556");
    //         var [result] = await sock.receive();
    //         var controllerReply=JSON.parse(result); 
    //         console.log("Before init msg ",controllerReply);
    //         var jsonInitMessage= {
    //             'Sender': "UI",
    //             'Source': "-",
    //             'Component': "-",
    //             'SessionId': `${req.sessionID}`,
    //             'Message': "Hello",
    //         };
    //         var jsonInit=JSON.stringify(jsonInitMessage);
    //         // both send() and receive() are blocking (by default)
    //         await sock.send(jsonInit);
    //         [result] = await sock.receive();
    //         // var rawStr = result.toString("utf-8");
    //         controllerReply=JSON.parse(result);
    //         console.log("After 2nd receive ",controllerReply);


    //         // save the received text into a file
    //         // fs.writeFile('./public/reasoner/jsonIncomingMessage.json', print, function(err) {
    //         //     if (err) return console.error(err);
    //         //     console.log('json text received > jsonIncomingMessage.txt');
    //         // });

    //     } catch(e) {
    //         console.error(e);
    //     }
    //     res.json({message: "connection with controller established"});

    //     // console.log('Received ',print);
    //     // res.json({message: print});
        
    // }
    // run();


    ///////////////////////////////////////////////////////////////////
    //// CONNECTION TO CONTROLLER
    ///////////////////////////////////////////////////////////////////
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
        // sessionId=1
        while(true){
            try{
                const option = await askForOption("Select option (Numbers 1 to 3): ");
                let rawdata = fs.readFileSync(`json_UI_example_${option}.json`);
                let json_msg = JSON.parse(rawdata)
                json_msg['SessionId']=req.sessionID;
         
                await pusher.send(JSON.stringify(json_msg));

                // sessionId=sessionId+1
            } catch(e) {
                console.error(e);
            }
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
                    console.log(json_msg);
                }
        
                if(json_msg["Source"].includes("KB")){
                    console.log("Inferred Labels:");
                    console.log(json_msg);
                }  
            } catch(e) {
                console.error(e);
            }
        }
    }

    thread1();
    thread2();

    res.json({message: `connection with controller established      sessionID: ${req.sessionID}`});
});


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
// (accessed at GET http://localhost:80/api/controller/getActionLabels?scenario=2&step=2)
.get((req, res) => {
    scenario = req.query.scenario;
    step = req.query.step;

    res.send("Scenario: " + scenario + "\t" + "Step: " + step);
    console.log("------------Confirming correct params------------");
    console.log("GET call to: " + req.path);
    console.log("Scenario: " + scenario + "\t" + "Step: " + step);

    // TODO: add messaging to controller
    
});

///////////// To be called to update file with sessionID, scenario and step
router.route('/controller/parseJson/:fileName')
// (accessed at GET http://localhost:80/api/controller/parseJson)
.get((req, res) => {
    // test session 
    console.log("req sessionID: ",req.sessionID);

    // this can only work once - require is synchronous, the calls receive a cached result
    // if the file is updated, it cannot be re-read
    // var jsonVision = require('./public/reasoner/jsonTest.json');

    // read json file, change a value and then re-write it
    // let rawdata = fs.readFileSync(`./public/reasoner/jsonTest.json`);
    let rawdata = fs.readFileSync(`./public/reasoner/${req.params.fileName}.json`);
    let controller = JSON.parse(rawdata);
    console.log(controller);
    // update sessionID
    controller.SessionId = req.sessionID;
    // controller.Sender = "UI";

    // add Scenario and Step tags at the start of the json file
    if (controller.Scenario) controller.Scenario = scenario;
    if (controller.Step) controller.Step = step;
    var addToJson = {"Scenario": scenario,"Step": step};
    var newJson = Object.assign(addToJson, controller)
    console.log("new json: ",newJson);
    fs.writeFileSync(`./public/reasoner/${req.params.fileName}.json`,JSON.stringify(newJson,null,2));

    // now copy json to txt file
    fs.copyFile(`./public/reasoner/${req.params.fileName}.json`, 
                `./public/reasoner/${req.params.fileName}.txt`, (err) => {
        if (err) throw err;
        console.log(`${req.params.fileName}.json was copied to ${req.params.fileName}.txt`);
    });

    res.json({message: `done parsing json. sessionid: ${req.sessionID}`});
});
