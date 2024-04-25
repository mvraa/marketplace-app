const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const express = require('express');
const session = require('express-session');

const passport = require('passport');

const app = express();
app.use(session({secret: "mysecret"}));
app.use(passport.initialize());
app.use(passport.session());

const moment = require('moment');
const path = require('path');

//////////////////LOGIN///////////////////

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
        clientID: "965143378167-fd6p1o5qleg5mprmgvjqefi0189rc2dv.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://localhost:3000/google/callback',
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({googleId: profile.id}, function(err, user){
            return done(null, profile);//user);
        // });
    }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

///////////////////////////

// Live Reload configuration
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Fontend route
const FrontRouter = require('./routes/front');

// Set ejs template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(connectLiveReload());

app.use(bodyParse.urlencoded({ extended: false }));
app.locals.moment = moment;

// Database connection
const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));


app.use(FrontRouter);

//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});