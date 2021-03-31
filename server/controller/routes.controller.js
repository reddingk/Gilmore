var express = require('express');
var router = express.Router();
/* Services */
var services = require('../services/services.service');


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
        var pageUrl = req.body.url;

        services.getPageData(pageUrl, function(ret){
            res.status(200).json(ret);
        });
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Getting Page Date: " + ex, "results":null });
    }
}

function sendEmail(req, res){
    try {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var message = req.body.message;

        services.sendEmail(name, email, phone, message, function(ret){
            res.status(200).json(ret);
        });
    }
    catch(ex){
        res.status(200).json({"errorMessage":"Error Sending Email: " + ex, "results":null });
    }
}

/*** Routes ***/
/* Site Routes */
router.get('/getCopyrightDate', getCopyrightDate);
router.post('/getServices', getServices);
router.post('/getPageData', getPageData);
router.post('/sendEmail', sendEmail);

module.exports = router;