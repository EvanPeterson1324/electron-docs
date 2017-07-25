const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/models').User;
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB! =)');
});

mongoose.connect(process.env.MONGODB_URI);                // Connect to our DB!

// BEGIN PASSPORT HERE -------------------------------------------------
const session = require('express-session');
app.use(session({
  secret: 'keyboard cat'
}));

require('./routes/auth')(passport);

// passport middlewaregit
app.use(passport.initialize());
app.use(passport.session());

// END PASSPORT HERE --------------------------------------------------------

// SOCKET HANDLER ------------------------------------------------------------
io.on('connection', socket => {
  console.log('connected');
  socket.on('editorState', function() {
    console.log(this.state.editorState);

    clientConnect(socket);

    socket.on('disconnect', function(){
        clientDisconnect(socket);
    });

    socket.on('para',function(data){
        //io.sockets.emit('updated_para',data.paragraph);
        socket.broadcast.emit('updated_para',data.paragraph);
    });
  });
  // socket.on('username', username => {
  //   if (!username || !username.trim()) {
  //     return socket.emit('errorMessage', 'No username!');
  //   }
  //   socket.username = String(username);
});

var activeClients = 0;
var Collaborators=['Colab1','Colab2','Colab3'];
var people=[];

function clientConnect(socket){
    //activeClients +=1;
    var userSocketId=socket.id;
    check_Collaborator(socket);

    io.sockets.emit('message', {uid: userSocketId});
}

var online_collabs=[];

function check_Collaborator(socket){
    socket.on('collabrator',function(data){
        if(Collaborators.indexOf(data) != -1){
            socket.data=data;

            if(online_collabs.indexOf(data)==-1) {
                online_collabs.push(data);
            }

            io.sockets.emit('online_collabs', online_collabs);
            io.sockets.emit('note_collabs', Collaborators);
        } else {
            console.log("collabrator not found");
        }
    });
}

function clientDisconnect(socket){
    var index=online_collabs.indexOf(socket.data)

    if(index>-1)
        online_collabs.splice(index,1);

    //activeClients -=1;
    //io.sockets.emit('message', {clients:activeClients});
    io.sockets.emit('remained_collabs',online_collabs);
}
// END SOCKET HANDLER --------------------------------------------------------

app.get('/', (req, res) => {
  res.send('Hit the / route!');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/users' , // TODO change the redirect link
    failureRedirect: '/login',
    failureFlash: "Incorrect Login Credentials",
    successFlash: "Login Successful!"
  })
);

app.post('/register', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;

  if(!isValidRegistration(username, password, confirmPassword)) {
    res.send("Invalid Registration details!");
  }
  saveUserInMongoDB(username, password);
  res.end();
});

app.get('/user', (req, res) => {
  res.send('User route!');
});

// Error handler/Catch 404 ---------------------------------------------------
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// ---------------------------------------------------------------------------

server.listen(3000, () => {
  console.log('Backend server for Electron Docs App running on port 3000!');
});

/**
 * This function saves a newly registered user into MongoDB
 * @param username
 * @param password
 * @return
 */
const saveUserInMongoDB = (username, password) => {
  new User({
    username,
    password
  })
  .save((err) => {
    if(err) {
      console.log("Error creating new user: ", err);
      return false;
    }
    console.log("User created!");
    return true;
  });
};

// @TODO Use passport to validate that the registered user is valid?????
const isValidRegistration = (username, password, confirmPassword) => {
  return true;
};
