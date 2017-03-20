// Required dependencies
var http = require('http'),
    express = require('express'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Variable initialization
var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

// Express server initialization
app.use(cookieSession({
        name: 'session',
        secret: 'secretKey'
    }))
    .use(express.static(__dirname + '/public'))
    .use('/bower_components', express.static(__dirname + '/bower_components'))
    .use(function(req, res, next) {
        if (typeof(req.session.todolist) == 'undefined') {
            req.session.todolist = [];
        }
        next();
    })
    .get('/todo', function(req, res) {
        res.render('todolist.ejs', { todolist: req.session.todolist });
    })
    .post('/todo/add', urlEncodedParser, function(req, res) {
        if (req.body.newTask !== '') {
            req.session.todolist.push(req.body.newTask);
        }
        res.redirect('/todo');
    })
    .get('/todo/delete/:id', function(req, res) {
        if (req.params.id !== '') {
            req.session.todolist.splice(req.params.id, 1);
        }
        res.redirect('/todo');
    })
    .use(function(req, res, next) {
        res.redirect('/todo');
    });


// Real time communication with Socket.IO
io.sockets.on('connection', function(socket) {

    socket.on('newTask', function(task) {
        socket.broadcast.emit('newTask', task);
    });

});

// Run the server on port 8080
server.listen(8080, function() {
    console.log('Application listening on port 8080 !');
});