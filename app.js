const express = require('express')
const http = require('http')
const fs = require('fs')
const app = express()
const port = 3000


app.set('view engine', 'css')
// all files inside public are static and available to the frontend
app.use(express.static('public'));
app.use(express.static('views'));

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})