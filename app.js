'use strict';

const port = process.env.port || 3000;
const express = require('express');
const app = express();
const morgan = require('morgan');
const models = require('./models/models');
const users = require('./routes/user');
const wiki = require('./routes/wiki');

module.exports = app;

const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

const init = async () => {
    await models.db.sync({ force: false });
    app.listen(port, () => {console.log(`listening on ${port}`);});
};

init();