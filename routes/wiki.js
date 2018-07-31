'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const { db, Page, User } = require('../models/models');
const { addPage, wikiPage, main } = require('../views');


const router = express.Router();
module.exports = router;

db.authenticate().then(() => {
    console.log('connected to database');
});

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.get('/', (req, res) => {
    res.redirect('wiki/search');
});

router.get('/search', async (req, res) => {
    try {
        const pages = await Page.findAll();
        // TODO add author
        res.send(main(pages));
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/', async (req, res) => {
    const page = new Page({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
    });
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });
    try {
        const [userInstance, wasCreated] = await User.findOrCreate({
            where: {
                name: user.name,
                email: user.email
            }
        });
        page.setAuthor(userInstance);
        await page.save();
        res.redirect(`/wiki/${page.slug}`);

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/add', (req, res) => {
    res.send(addPage());
});

router.get('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });
        const user = await page.getAuthor();
        res.send(wikiPage(page, user));
    } catch (error) {
        console.log(error);
        next(error);
    }
});
