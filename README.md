# SoCoLa-Server
The User Interface of the SoCoLa Demo. It includes both the back-end (web server) and the front-end (client). 

## Webpage of the Demo

[SoCoLa Demo 7.3](http://139.91.183.118:443/)

![Initial State of the UI](https://drive.google.com/uc?export=view&id=1mVrJ0UTL12U3TKxieTYZlJDm8jOGYGC4)

### Includes
* Connection to the Controller Component with use of the [ZeroMQ](https://zeromq.org/) library.
* Executable (jar) that uses the [Clingo](https://potassco.org/clingo/) reasoner to provide Answer Sets. Needed files for the reasoner also included.


## Built with

* [NodeJS](https://nodejs.org/en/) - Open-Source, cross-platform, back-end, JavaScript runtime environment that executes JS code outside a web server
* [ExpressJS](https://expressjs.com/) - Fast, minimal and flexible web framework for Node.js
* [HTML & CSS](https://www.w3.org/standards/webdesign/htmlcss.html) - Core technologies for the front-end, providing the structure and design of the webpage
* [JavaScript](https://www.w3schools.com/js/default.asp) - Programming language for the web (front-end)

Use of Node.js with Express for the setup of the web server. Implementation of a REST API for server-client stateless connection. 
Creation of routes with Express, to define specific URLs/paths for each service.