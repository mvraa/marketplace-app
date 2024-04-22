const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const express = require('express');
const app = express();
const moment = require('moment');
const path = require('path');

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