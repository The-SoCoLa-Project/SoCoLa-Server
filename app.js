const express = require('express')
const app = express()

const http = require('http')
const fs = require('fs')    // file system module
const path = require('path')

const port = 7000
const hostname = 'localhost'

// app.set('view engine', 'css')
// all files inside public are static and available to the frontend
app.use(express.static('public'));
app.use(express.static('views'));
// app.set('views', './views');
// will not need to add app.get to specify URL to index.html, since its the only html file we have

app.listen((process.env.port || port), hostname, () => {
    console.log(`Server is listening at    http://${hostname}:${(process.env.port || port)}/`)
})