// Required dependencies
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    hbs = require('hbs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Variable initialization
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'html')
    .engine('html', hbs.__express)
    .use(express.static(__dirname + '/public'))
    .use('/bower_components', express.static(__dirname + '/bower_components/'))
    .use(session({
        secret: "todo-secret",
        resave: false,
        saveUninitialized: true
    }))
    .get('/todolist', function(req, res) {
        if (typeof req.session.todolist == 'undefined') {
            req.session.todolist = [];
        }

        res.render('index', { tasks: req.session.todolist });
    })
    .post('/todolist/add', urlencodedParser, function(req, res) {
        var newTask = req.body.newTask;

        if (newTask !== null) {
            req.session.todolist.push(newTask);
        }

        res.redirect('/todolist');
    })
    .get('/todolist/delete/:id', function(req, res) {
        req.session.todolist.splice(req.params.id, 1);

        res.redirect('/todolist');
    })
    .use('/', function(req, res, next) {
        res.redirect('/todolist');

        next();
    });

io.on('connection', function(socket) {
    console.log('Listening on : 8080');
});

// Run the server on port 8080
server.listen(8080, function() {
    console.log('Application listening on port 8080 !');
});