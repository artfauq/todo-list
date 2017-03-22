// Required dependencies
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session')({
        secret: "secretKey",
        resave: false,
        saveUninitialized: true
    }),
    sharedSession = require('express-socket.io-session'),
    hbs = require('hbs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Variable initialization
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'html')
    .engine('html', hbs.__express)
    .use(session)
    .use(express.static(__dirname + '/public'))
    .use('/bower_components', express.static(__dirname + '/bower_components/'))
    .get('/todolist', function(req, res) {
        if (typeof req.session.todolist == 'undefined') {
            req.session.todolist = [];
        }

        res.render('index');
    })
    .use('/', function(req, res, next) {
        res.redirect('/todolist');

        next();
    });

io.use(sharedSession(session, {
    autoSave: true
}));

io.on('connection', function(socket) {
    console.log('Socket.IO listening on port 8080 !');

    socket.emit('initialize', socket.handshake.session.todolist);

    socket.on('newTask', function(newTask) {
        socket.handshake.session.todolist.push(newTask);
        socket.handshake.session.save();

        socket.emit('addTask', {
            index: socket.handshake.session.todolist.indexOf(newTask),
            content: newTask
        });

        socket.broadcast.emit('addTask', {
            index: socket.handshake.session.todolist.indexOf(newTask),
            content: newTask
        });
    });

    socket.on('removeTask', function(index) {
        socket.handshake.session.todolist.splice(index, 1);
        socket.handshake.session.save();

        socket.emit('removeTask', index);
        socket.broadcast.emit('removeTask', index);
    });
});

// Run the server on port 8080
server.listen(8080, function() {
    console.log('Express listening on port 8080 !');
});