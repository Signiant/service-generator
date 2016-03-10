var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var cleanup = require('./lib/cleanup.js');
var initSockets = require('./lib/yo-sockets.js');

cleanup(path.join(__dirname, 'dist'), false);

initSockets(io, __dirname);

app.use('/', express.static('public'));

server.listen(3000);
console.log("Listening on port 3000");
