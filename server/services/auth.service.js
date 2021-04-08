require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
var randomstring = require("randomstring");
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const mailgun = require('mailgun-js')({ apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName, mongoOptions:{ useUnifiedTopology: true }
}

var services = {
    paramCheck(params, obj) {
        var ret = true;
        try {
            if(!obj){
                ret = false;
            }
            else{
                for(var i = 0; i < params.length; i++){
                    if(!(params[i] in obj) || obj[params[i]] == null){
                        console.log(params[i], " is missing ");
                        ret = false;
                        break;
                    }
                }
            }
        }
        catch(ex){
            console.log("checking params");
            ret = false;
        }
        return ret;
    },
    authenticateJWTUser: function(token, callback){
        try {
            var decoded = jwt.verify(token, process.env.GILMORE_SECRET);
            if(!decoded) {
                callback({ status: false, error: "Invalid Token" });
            }
            else {
                _getUserByEmail(decoded.email, function(res){
                    if(res.error){
                        res.status = false; callback(res);
                    }
                    else {
                        callback({ status: (decoded._id == res.results._id), results: decoded });                    
                    }
                }); 
            }
        }
        catch(ex){
            var err = util.format("Error Authenticating JWT Token On: %s", ex);
            log.error(err);
            callback({ "error":err});
        }
    },
    userLogin: function(email, pwd, callback){
        var response = {"error":null, "results":null};

        try {
            _getUserByEmail(email, function(res){
                if(res.error){
                    callback(res);
                }
                else {                    
                    if(res.results.tmpPwd && res.results.tmpPwd.length > 0){
                        _comparePwd(pwd, res.results.tmpPwd, function(dataRet){
                            if(dataRet.error) {
                                callback(dataRet);
                            }
                            else if(dataRet.results == true){
                                callback({ results: { status: "temporary" }});
                            }
                            else {
                                _comparePwd(pwd, res.results.pwd, function(dataRet2){
                                    if(dataRet2.error) {
                                        callback(dataRet2);
                                    }
                                    else if(!dataRet2.results){
                                        callback({ error: "Invalid Password" });
                                    }
                                    else {
                                        delete res.results.pwd;
                                        delete res.results.tmpPwd;

                                        // Set Expiration Date
                                        res.results.expDt = new Date();
                                        res.results.expDt.setDate(res.results.expDt.getDate() + parseInt(process.env.PWD_EXPIRATION));                            
                                        res.results.expDt = res.results.expDt.getTime();
                                        
                                        var token = jwt.sign(res.results, process.env.GILMORE_SECRET);

                                        callback({"results": { status: "default", token: token} });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        _comparePwd(pwd, res.results.pwd, function(dataRet2){
                            if(dataRet2.error) {
                                callback(dataRet2);
                            }
                            else if(!dataRet2.results){
                                callback({ error: "Invalid Password" });
                            }
                            else {
                                delete res.results.pwd;

                                // Set Expiration Date
                                res.results.expDt = new Date();
                                res.results.expDt.setDate(res.results.expDt.getDate() + process.env.PWD_EXPIRATION);                            
                                res.results.expDt = res.results.expDt.getTime();
                                
                                var token = jwt.sign(res.results, process.env.GILMORE_SECRET);

                                callback({"results": { status: "default", token: token} });
                            }
                        });
                    }
                }
            });
        }
        catch(ex){
            response.error = "[Error] User Login: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    forgotPwd(email, callback){
        var response = {"error":null, "results":null};

        try {
            _getUserByEmail(email, function(res){
                if(res.error){
                    callback(res);
                }
                else { 
                    // Generate Temp Password
                    var tmpPwd = randomstring.generate({ length: 12 });
                    // Set Temp Password to DB
                    mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                        if(err) {
                            response.error = err;
                            if(client) { client.close(); }
                            callback(response);
                        }
                        else {
                            
                            var pwdHash = bcrypt.hashSync(tmpPwd, parseInt(process.env.SALT_ROUNDS));
            
                            const db = client.db(database.dbName).collection('users');
                            db.updateOne({ "_id": ObjectId(res.results._id) }, { $set: { tmpPwd: pwdHash } },
                                function(updateError,retObj){
                                    if(updateError || (retObj.matchedCount <= 0)){
                                        response.error = updateError;
                                        client.close();
                                        callback(response);
                                    }
                                    else {
                                        client.close();
                                        // Email Temp Password to User
                                        console.log("[T0] ", res.results.email, " | P: ", tmpPwd);
                                        _sendTempEmail(res.results.email, tmpPwd, callback);
                                    } 
                                });          
                        }
                    });
                }
            });
        }
        catch(ex){
            response.error = "[Error] Forgot Password: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    resetPwd(email, tmpPwd, newPwd, callback){
        var response = {"error":null, "results":null};

        try {
            _getUserByEmail(email, function(res){
                if(res.error){
                    callback(res);
                }
                else if(res.results.tmpPwd && res.results.tmpPwd.length > 0){ 
                    _comparePwd(tmpPwd, res.results.tmpPwd, function(dataRet){
                        if(dataRet.error) {
                            callback(dataRet);
                        }
                        else if(!dataRet.results){
                            callback({ error: "Temporary Password Does Not Match"});
                        }
                        else {
                            _pwdReset(res.results._id, newPwd, callback); 
                        }
                    });
                }
                else {
                    _pwdReset(res.results._id, newPwd, callback); 
                }
            });
        }
        catch(ex){
            response.error = "[Error] Reset Password: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    updateService(id, name, location, date, callback){
        var response = {"error":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.error = err;
                    if(client) { client.close(); }
                    callback(response);
                }
                else {   
                    // Convert date to time
                    date = (new Date(date)).getTime(); 

                    const db = client.db(database.dbName).collection('services');
                    if(id){
                        // Update
                        db.updateOne({ "_id": ObjectId(id) }, { $set: { name: name, location:location, date: date } }, function(updateError,retObj){
                            if(updateError){
                                response.error = updateError;
                            }
                            else if(retObj.matchedCount > 0){
                                response.results = id;                                                                  
                            }
    
                            client.close();                            
                            callback(response);
                        });
                    }
                    else {
                        db.insertOne({ name: name, location:location, date: date }, function(insertError,retObj){
                            if(insertError){
                                response.error = insertError;
                            }
                            else {
                                response.results = (retObj.ops.length > 0 ? retObj.ops[0]._id : null);                         
                            }
                            client.close();                            
                            callback(response);
                        });
                    }
                }
            });
        }
        catch(ex){
            response.error = "[Error] Adding/Updating Service "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    removeService(id, callback){
        var response = {"error":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.error = err;
                    if(client) { client.close(); }
                    callback(response);
                }
                else {   
                    const db = client.db(database.dbName).collection('services');
                    db.deleteOne({ "_id": ObjectId(id) }, function(updateError, retObj){
                        if(updateError){
                            response.error = updateError;
                        }
                        else {
                            response.results = true;
                        }                        
                        client.close();
                        callback(response);
                    });
                }
            });
        }
        catch(ex){
            response.error = "[Error] Removing Service "+ ex;
            console.log(response.error);
            callback(response);
        }
    }
}

module.exports = services;

/* Compare Passwords */ 
function _comparePwd(inputPwd, serverPwd, callback){
    var response = {"error":null, "results":null};

    try {
        bcrypt.compare(inputPwd, serverPwd, function(err, resCmp){
            if(err){
                callback({"error":"Error Validating Password: "+ err });
            }
            else { 
                callback({"results": resCmp });
            }
        });
    }
    catch(ex){
        response.error = "Error Comparing Passwords :" + ex;
        console.log(response.error);
        callback(response);
    }
}

/* Send Temp Email */
function _sendTempEmail(email, tmpPwd, callback){
    var response = { "error":null, "results":false };
    try {
        var d = Date.now(), ret ="";
        ret +=  util.format('<h1>Reset Password</h1>');
        ret +=  util.format('<p>Your email address requested to have your password reset, if you received this in error please disregard this email.</p>');
        ret +=  util.format('<p>If this is a valid request please click the link below and complete the password reset.</p>');
        ret +=  util.format('<a href="http://localhost:3000/login?resetCode=%s" target="_blank">Reset Link</a>', tmpPwd);             

        var mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Gilmore Website Password Reset",
            html: ret
        };

        mailgun.messages().send(mailOptions, function (err, body) {
            if (err) {
                console.log("[Error] Sending Temporary Email: ", err);
                response.error = err;
            }
            else {
                console.log("Temporary Email Sent");
                response.results = 'Temporary Email Sent';
            }
            callback(response);
        });
    }
    catch(ex){
        response.error = "Error Sending Temporary Email " + email +" :" + ex;
        console.log(response.error);
        callback(response);
    }
}

/* Get User From DB */
function _getUserByEmail(email, callback){
    var response = { "error":null, "results":false };
    try {
        if(email) {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.error = err;
                    if(client) { client.close(); }
                    console.log("Getting User By Email: " + err);
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('users');
                    db.find({ email: email }).toArray(function(err, res){ 
                        if(err) { response.error = "[Error] Retrieving User: "+ err; }
                        else if(res.length == 0) { response.error = "No Users Found"; }
                        else {  response.results = res[0]; }
                        client.close();
                        callback(response);  
                    });                   
                }
            });
        }
        else {
            response.error = "No Email Address To Look Up";
            callback(response);
        }
    }
    catch(ex){
        response.error = "Error Getting User " + email +" :" + ex;
        console.log(response.error);
        callback(response);
    }
}

/* Reset Password */
function _pwdReset(id, pwd, callback){
    var response = { "error":null, "results":false };
    try {        
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.error = err;
                if(client) { client.close(); }
                callback(response);
            }
            else {
                
                var pwdHash = bcrypt.hashSync(pwd, parseInt(process.env.SALT_ROUNDS));

                const db = client.db(database.dbName).collection('users');
                db.updateOne({ "_id": ObjectId(id) }, { $set: { pwd: pwdHash, tmpPwd:"" } },
                    function(updateError,retObj){
                        if(updateError){
                            response.error = updateError;
                        }
                        else {
                            response.results = (retObj.matchedCount > 0);
                        }
                            
                        client.close();
                        callback(response);
                    });          
            }
        });
    }
    catch(ex){
        response.error = util.format("Error Adding User [%s] : %s", userInfo.userId , ex);
        console.log(response.error);
        callback(response);
    }
}