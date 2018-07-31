'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const { userList, userPages } = require('./../views');
const { db, Page, User } = require('../models/models');

const router = express.Router();
module.exports = router;

db.authenticate().then(() => {
    console.log('connected to database');
});

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        // TODO add author
        res.send(userList(users));
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        const pages = await Page.findAll({
            where: {
                authorId: id
            }
        });
        res.send(userPages(user, pages));
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/:id', (req, res) => {
    res.send('AAA');
});
