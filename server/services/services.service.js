require('dotenv').config();
const StoryblokClient = require('storyblok-node-client');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const Storyblok = new StoryblokClient({
    privateToken: process.env.STORYBLOK_TOKEN,
    cache: { clear: 'auto', type: 'memory'}
  });

const database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName, mongoOptions:{ useUnifiedTopology: true }
}

const mailgun = require('mailgun-js')({ apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

var services = {
    getPageData: function(url, callback){
        var response = {"error":null, "results":null};

        try {
            // Clear Cache
            Storyblok.flushCache();

            // Get Data
            Storyblok.get(url, { version: 'published' })
                .then((ret) => {
                    if(ret.statusCode != 200){
                        response.error = "Unable to access Data"
                    }
                    else {
                        response.results = ret.body.story.content;
                    }
                    callback(response);
                })
                .catch((error) => {
                    response.error = error;
                    console.log(error);
                    callback(response);
                });
        }
        catch(ex){
            response.error = "[Error]: Getting Storyblok Page Data: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    getServices: function(serviceQuery,callback){
        var response = {"error":null, "results":{ list: null, pageCount: 1}};
        try {
            

            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.error = err;
                    if(client) { client.close(); }
                    callback(response);
                }
                else {   
                    /* { page, size, search } */
                    var startVal = (serviceQuery.page - 1) * serviceQuery.size;
                    var endVal = startVal + serviceQuery.size;

                    const db = client.db(database.dbName).collection('services');
                    db.find({ name: new RegExp(serviceQuery.search,'i') })
                        .toArray(function(err, res){ 
                            client.close();

                            if(err) { 
                                response.error = "[Error] Retrieving Services: "+ err;
                                callback(response); 
                            }
                            else {
                                response.results.list = res.sort((a, b) => new Date(a.date) - new Date(b.date));
                                // Get Page Count
                                response.results.pageCount = Math.ceil(response.results.list.length / serviceQuery.size);
                                // Get List Sub Set
                                response.results.list = response.results.list.slice(startVal, endVal);
                                callback(response);                                                                            
                            }
                        });     
                }
            });
        }
        catch(ex){
            response.error = "[Error]: Getting Services: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    sendEmail: function(name, email, phone, message, callback){
        try {
            var d = Date.now();

            var mailOptions = {
                from: process.env.MAILGUN_SMTP_LOGIN,
                to: process.env.ADMIN_EMAIL,
                subject: "Website User Email " + d.toISOString(),
                html: buildEmailHtml(email, name, phone, message)
            };

            mailgun.messages().send(mailOptions, function (err, body) {
                if (err) {
                    console.log("[Error] Sending Email: ", err);
                    response.error = err;
                }
                else {
                    console.log("Email Sent");
                    response.results = 'Email Sent';
                }
                callback(response);
            });
        }
        catch(ex){
            response.error = "[Error] Sending Email: "+ ex;
            console.log(response.error);
            callback(response);
        }
    }
}

module.exports = services;

function buildEmailHtml(email, name, phone, message){
    var ret = "";
    try {        
        ret +=  util.format('<h1>User Email</h1>');
        ret +=  util.format('<p>Email: %s</p>', email);
        ret +=  util.format('<p>Name: %s</p>', name);
        ret +=  util.format('<p>Phone: %s</p>', phone); 
        ret +=  util.format('<br/><p>Message: %s</p>', message);      
    }
    catch(ex){
        console.log("[Error] Error building email html: ",ex);        
    }

    return ret;
}