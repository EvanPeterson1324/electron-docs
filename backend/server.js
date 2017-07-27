const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/models').User;
const Doc = require('./models/models').Doc;
const server = require('http').createServer(app);
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

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// END PASSPORT HERE --------------------------------------------------------

// SOCKET HANDLER ------------------------------------------------------------
io.on('connection', socket => {
  socket.on('newEvent', function() {
  });

  socket.on('joinRoom', function(docId) {
    socket.roomId = docId;
    console.log('JOINED ROOM', socket.roomId);
    socket.join(docId);
  })

  socket.on('liveEdit', (obj) => {
    var stringRaw = JSON.parse(obj).stringRaw
    var roomId = JSON.parse(obj).docId
    console.log('BROADCASTING TO ', roomId);
    io.to(roomId).emit('broadcastEdit', stringRaw);
  });

  socket.on('disconnect', () => {
    if (socket.roomId) {
      socket.leave(socket.roomId);
    }
  })
});



// END SOCKET HANDLER --------------------------------------------------------

app.get('/', (req, res) => {
  res.send('Hit the / route!');
});

app.get('/login', (req, res) => {
  res.send('We good fham');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/user' , // TODO change the redirect link
    failureRedirect: '/failureLogin',
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

// Login Success!
app.get('/user', (req, res) => {
  res.send({success: true});
});

// Login Failed!
app.get('/failureLogin', (req, res) => {
  res.send({success: false});
});

app.get('/docs', (req, res) => {
  User.findOne({username: req.user.username})
  .then((user) => {
    res.json({user: user});
  })
  .catch((err) => {
    res.json({failure: err});
  });
});

app.post('/createDoc', (req, res) => {
  var newDoc = new Doc({
    title: req.body.title,
    author: req.user.username,
    password: req.body.password
  });
  newDoc.save((err, doc) => {
    if (err) {
      res.json({failure: err});
    }

    User.findOne({username: req.user.username})
    .then((user) => {
      user.docs.push({id: doc._id, isOwner: true});
      user.save((err, user) => {
        if(err) { res.json(err); }
        res.json({
          success: true,
          title: req.body.title,
          author: req.user.username,
          docId: doc._id
        });
      });
    });
  });
});

// This route is for when we want to make a new doc
app.post('/editor/new', (req, res) => {
  // We need the  doc title, documentId and author
  // var author = req.user.username;
  // var documentId = req.body.docId;
  // var docTitle = req.body.docTitle;


});

// This route is for when we want to open a saved document
app.post('/editor/saved', (req, res) => {
  var docId = req.body.docId;
  Doc.findById(docId)
  .then((doc) => {
    if(!doc) {
      res.json({
        success: false,
        error: "MongoDB Error: The document could not be found!"
      });
    }
    res.json({
      success: true,
      doc: doc
    });
  });
});

app.post('/save', (req, res) => {
  console.log('THIS IS ME SAVING', docId, version);
  var docId = req.body.docId;
  var version = req.body.version;
  Doc.findById(docId)
  .then((doc) => {
    doc.versions.unshift(version);
    doc.save((err) => {
      if (err) {
        res.json({failure: err});
      } else {
        res.json({success: true});
      }
    });
  });
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
  new User({username, password})
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
