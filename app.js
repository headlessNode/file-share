const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/indexRouter.js');

// EXPRESS SETUP //

const assestsPath = path.join(__dirname, 'public');
app.use(express.static(assestsPath));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ROUTES //

app.use( '/', indexRouter );


// SERVER STARTUP //

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started.....');
});