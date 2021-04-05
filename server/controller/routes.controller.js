var express = require('express');
var router = express.Router();
/* Services */
var services = require('../services/services.service');
var auth = require('../services/auth.service');


function getCopyrightDate(req, res){
    try {
        var d = new Date();
        res.status(200).json({"errorMessage":null, "results":d.getFullYear() });
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Processing Request: " + ex, "results":null });
    }
}

function getServices(req, res){ 
    try {
        var serviceQuery = req.body;

        services.getServices(serviceQuery, function(ret){
            res.status(200).json(ret);
        });
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Processing Request: " + ex, "results":null });
    }
}

function getPageData(req, res){ 
    try {
        if(req.body && auth.paramCheck(["url"], req.body)){
            var pageUrl = req.body.url;

            services.getPageData(pageUrl, function(ret){
                res.status(200).json(ret);
            });
        }
        else {
            res.status(200).json({"errorMessage":"Invalid Params", "results":null });
        }
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Getting Page Date: " + ex, "results":null });
    }
}

function sendEmail(req, res){
    try {
        if(req.body && auth.paramCheck(["name", "email", "phone","message"], req.body)){
            var name = req.body.name;
            var email = req.body.email;
            var phone = req.body.phone;
            var message = req.body.message;

            services.sendEmail(name, email, phone, message, function(ret){
                res.status(200).json(ret);
            });
        }
        else {
            res.status(200).json({"errorMessage":"Invalid Params", "results":null });
        }
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Sending Email: " + ex, "results":null });
    }
}

function userLogin(req, res){
    try {
        if(req.body && auth.paramCheck(["email", "password"], req.body)){
            auth.userLogin(req.body.email, req.body.pwd, function(ret){
                res.status(200).json(ret);
            });
        }
        else {
            res.status(200).json({"errorMessage":"Invalid Params", "results":null });
        }
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error With User Login: " + ex, "results":null });
    }
}

function forgotPwd(req, res){
    try {
        if(req.body && auth.paramCheck(["email"], req.body)){
            auth.forgotPwd(req.body.email, function(ret){
                res.status(200).json(ret);
            });
        }
        else {
            res.status(200).json({"errorMessage":"Invalid Params", "results":null });
        }
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error With Forgot Password: " + ex, "results":null });
    }
}

function resetPwd(req, res){
    try {
        if(req.body && auth.paramCheck(["email", "tmpPassword","password"], req.body)){
            auth.resetPwd(req.body.email, req.body.tmpPassword, req.body.password, function(ret){
                res.status(200).json(ret);
            });
        }
        else {
            res.status(200).json({"errorMessage":"Invalid Params", "results":null });
        }
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error With Password Reset: " + ex, "results":null });
    }
}

/*** Routes ***/
/* Site Routes */
router.get('/getCopyrightDate', getCopyrightDate);
router.post('/getServices', getServices);
router.post('/getPageData', getPageData);
router.post('/sendEmail', sendEmail);

/* Admin Routes */
router.post('/login', userLogin);
router.post('/forgotPassword', forgotPwd);
router.post('/resetPassword', resetPwd);

module.exports = router;