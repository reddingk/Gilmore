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

/*** Routes ***/
/* Site Routes */
router.get('/getCopyrightDate', getCopyrightDate);
router.post('/getServices', getServices);

module.exports = router;