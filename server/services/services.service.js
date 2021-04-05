require('dotenv').config();
const StoryblokClient = require('storyblok-node-client');

let Storyblok = new StoryblokClient({
    privateToken: process.env.STORYBLOK_TOKEN,
    cache: { clear: 'auto', type: 'memory'}
  });

//const mailgun = require('mailgun-js')({ apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

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
        try {
            var response = {"error":null, "results":{ list: null, pageCount: 1}};

            /* { page, size, search } */
            var startVal = (serviceQuery.page - 1) * serviceQuery.size;
            var endVal = startVal + serviceQuery.size;

            // TEST            
            Date.prototype.addDays = function(days, time) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                date.setHours(time);
                return date;
            }
            var d = new Date();

            var tmpSvc = [
                { name:"Joe Smith", location:"Chapel A", date: d.addDays(1,19) },
                { name:"Betty Wilson", location:"Chapel B", date: d.addDays(1,18) },
                { name:"AJ Rodger", location:"Chapel C", date: d.addDays(3,12) },
                { name:"Kathrine Jensah", location:"Chapel E", date: d.addDays(4,9) },
                { name:"Thomas Hamilton", location:"Chapel D", date: d.addDays(10,15) },

                { name:"Jane Joy", location:"Chapel A", date: d.addDays(15,13) },
                { name:"Trent Enter", location:"Chapel E", date: d.addDays(7,16) },
                { name:"Mike Camp", location:"Chapel C", date: d.addDays(30,16) },
                { name:"Trina Whales", location:"Chapel B", date: d.addDays(15,18) },
                { name:"Adrian Cashew", location:"Chapel D", date: d.addDays(22,19) },

                { name:"Ivan Eats", location:"Chapel E", date: d.addDays(15,13) },
                { name:"Mildred Falls", location:"Chapel B", date: d.addDays(7,16) },
                { name:"Tony Explorer", location:"Chapel A", date: d.addDays(30,16) },
                { name:"May Catch", location:"Chapel D", date: d.addDays(15,18) },
                { name:"Steve Bar", location:"Chapel B", date: d.addDays(22,19) },

                { name:"Ivan Eats Jr.", location:"Chapel B", date: d.addDays(15,13) },
                { name:"Mildred Walls", location:"Chapel C", date: d.addDays(7,16) },
                { name:"Titan Max", location:"Chapel D", date: d.addDays(30,16) },
                { name:"August Klone", location:"Chapel C", date: d.addDays(15,18) },
                { name:"Junie Bart", location:"Chapel A", date: d.addDays(22,19) }
            ];

            response.results.list = tmpSvc.filter(function(item){ return item.name.toLowerCase().indexOf(serviceQuery.search.toLowerCase()) >= 0; }).sort((a, b) => new Date(a.date) - new Date(b.date));
            // Get Page Count
            response.results.pageCount = Math.ceil(response.results.list.length / serviceQuery.size);
            // Get List Sub Set
            response.results.list = response.results.list.slice(startVal, endVal);

            callback(response);
        }
        catch(ex){
            response.error = "[Error]: Getting Services: "+ ex;
            console.log(response.error);
            callback(response);
        }
    },
    sendEmail: function(name, email, phone, message, callback){
        try {
            /*var d = Date.now();

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
            });*/
            console.log("Email Sent");
            response.results = 'Email Sent';
            callback(response);
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