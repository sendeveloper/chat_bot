var http = require('http');
var sockjs = require('sockjs');
var express = require('express');
var path = require('path');
var models = require('./models.js');
var constants = require('./constants.js');
var firebase = require('firebase');
var crypto = require('crypto');
const bodyParser= require('body-parser');

var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 8080;
var production = process.env.NODE_ENV === 'production';

var comments = [];
var connections = {};
var users = {};

// send message to specific connection/user
function whisper (id, message) {
    if ( !connections[id] ) return;
    connections[id].write(JSON.stringify(message));
}

// broadcast message to all users
function broadcast (message) {
    if ( comments.length > 15 ) comments.shift();
    for ( var i in connections ) {
        connections[i].write(JSON.stringify(message));
    }
    comments.push(message);
}

// Sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
var sockjs_chat = sockjs.createServer(sockjs_opts);

sockjs_chat.on('connection', function(conn) {
    connections[conn.id] = conn;

    // send message notifying of existing users on the channel
    whisper(conn.id, new models.Message({
        data: users,
        type: constants.user_list
    }));

    // create user model and add it to list of users
    var user = new models.User({
        connection_id: conn.id,
        username: 'guest' + new Date().getSeconds()
    })
    users[conn.id] = user;

    // send a brief history of messages
    whisper(conn.id, new models.Message({
        data: comments,
        type: constants.history_list
    }));

    // broadcast the user joining
    broadcast(new models.Message({
        type: constants.joined_channel,
        text: ' has just joined the channel',
        username: user.username,
        data: user
    }));

	conn.on('data', function onDataCB (message) {
    	message = JSON.parse(message);
        if ( message.type == constants.text_message ) {
            if (message.text.startsWith('/')) {
                // whisper the command back to the user
                whisper(conn.id, new models.Message({
                    type: constants.private,
                    text: message.text
                }))

                // management commands
                if (message.text == '/help') {
                    whisper(conn.id, new models.Message({
                        type: constants.help,
                        text: constants.help_text
                    }))
                }
                if (message.text.startsWith('/nick')) {
                    var old_username = users[conn.id].username;
                    var new_username = message.text.substring(message.text.indexOf(' ')+1);
                    users[conn.id].username = new_username;

                    broadcast(new models.Message({
                        type: constants.username_changed,
                        text: old_username + ' is now ' + new_username,
                        data: {
                            username: new_username,
                            connection_id: conn.id
                        }
                    }))
                }
            } else {
    			if ( !message.text ) return;
    			message.text = message.text.substr(0, 128)

                // broadcast the received message
    			broadcast(new models.Message({
                    type: constants.text_message,
                    text: message.text,
                    username: users[conn.id].username
                }));
            }
        }
	});

	conn.on('close', function onCloseCB () {
        // delete the connection and the user
        var user = users[conn.id] || {};
		delete connections[conn.id];
        delete users[conn.id];
		broadcast(new models.Message({
            text: ' has just left the channel',
            username: user.username,
            type: constants.left_channel
        }));
	});
});

if (production) {
    /*app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/../index.html'))
    })*/
    app.use(express.static(path.resolve(__dirname, '../build')));
}
sockjs_chat.installHandlers(server, {prefix:'/chat'});
server.listen(port, '0.0.0.0', function() {
    console.log("Listening on " + port);
})

// API Call
firebase.initializeApp(constants.firebase_config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.post('/api/login', (req, res) => {
  var email = req.query.email,
      pass = req.query.password;
  res.statusCode = 200;
  res.json(req.body);
});

app.post('/api/register', (req, res) => {
  var first_name = req.body.first_name,
      last_name = req.body.last_name,
      email     = req.body.email,
      username  = req.body.username;
      password  = req.body.password;
  res.statusCode = 200;
  if (first_name != '' && last_name != '' && email != '' && username != '' && password != '')
  {
    var md5sum = crypto.createHash('md5');
    var rootRef = firebase.database().ref();
    var userRef = rootRef.child("users");
    var found = false, count = 0;
    password = md5sum.update(password).digest('hex');
    userRef.on("value", function(snapshot) {
      console.log(++count);
    })
    if (count > 0)
    {
      userRef.orderByChild('email').equalTo(email).on("value", function(snapshot) {
        res.statusCode = 204;
        found = true;
      })
      userRef.orderByChild('username').equalTo(username).on("value", function(snapshot) {
        res.statusCode = 204;
        found = true;
      })
    }
    if (found == false)
    {
      var newUserRef = userRef.push();
      newUserRef.set({
        first_name:   first_name,
        last_name:    last_name,
        email:        email,
        username:     username,
        password:     password
      });
    }
  }
  else
  {

  }
  res.json(req.body);
})
