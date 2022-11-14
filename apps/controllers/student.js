var express = require("express");
var router = express.Router();
//const {check,validationResult} = require('express-validator');

const path = require('path');
const upload = require('../uploadMiddleware');
const Resize = require('../Resize');

// var user_md = require('../modles/user');
// var post_md = require('../modles/post');
// var news_md = require('../modles/news');
// var helper = require("../helpers/helper");


router.get("/", function (req, res) {
     res.render("signin", { data: {} });
});


router.get('/signup', function (req, res) {
    res.render("signup", { data: {} });
})



module.exports = router;