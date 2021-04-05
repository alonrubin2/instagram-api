const bodyParser = require('body-parser');
const express = require('express')
const mongoose = require('mongoose');
const routes = require('./config/routes');
const cors = require('cors');
const { port, dbUrl } = require('./config/enviornment/index');


const app = express();



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);




mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    app.listen(port, () => {
        console.log('Listening on http://localhost:' + port);
    });
});