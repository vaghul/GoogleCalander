/* Author: Vaghula Krishnan
*/
var express = require('express');
var router = express.Router();
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');
var moment = require('moment');

var CLIENT_ID = '491339976599-v3m3u4cb9vetmphk0kbj3vr28lop2fl6.apps.googleusercontent.com';
var CLIENT_SECRET = 'KVQMxNC-NWKmKaFPLPXMAdhL';
var REDIRECT_URL = 'http://localhost:3000/users/';
var TOKEN_PATH = __dirname+'/gmail-api-quickstart.json';

/* GET users listing. */
router.get('/', function(req, res) {
    console.log(req.query.code);
  code=req.query.code;
  // console.log("here");
  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


if (fs.existsSync(TOKEN_PATH)) {
  // do something
  console.log("file available");
  fs.readFile(TOKEN_PATH, function(err, token) {
    if(!err){
    oauth2Client.credentials = JSON.parse(token);

  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
      profile=profile.displayName;
      console.log("profile "+profile);
            res.render('cal', { title: 'Create event',profile:profile});

          });
        }
  });
}
else {

  console.log("file not available");
  getAccessToken(oauth2Client, function() {
    console.log("things on process");
    var profile;
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
      if (err) {
        console.log('An error occured', err);
        return;
      }
        profile=profile.displayName;
              res.render('cal', { title: 'Create event',profile:profile});

    });
      });
      function getAccessToken(oauth2Client, callback) {
        //console.log("reached here");


        oauth2Client.getToken(code, function(err, token) {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
          }
        //  console.log(JSON.parse(token));
        oauth2Client.setCredentials(token);
        //console.log(token);
        storeToken(token);
          callback();
        });
      }

      function storeToken(token)
      {
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
      }

}


});
router.post('/', function(req, res) {
  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  fs.readFile(TOKEN_PATH, function(err, token) {
    if(!err){
    oauth2Client.credentials = JSON.parse(token);
    //console.log(req.body);

    var emaillist=req.body.participants.split(",");


    var event = {
    'summary': req.body.title,
    'location': req.body.location,
    'description': req.body.description,
    'start': {
      'dateTime': moment(new Date(req.body.start_date)).format()
    },
    'end': {
      'dateTime':moment(new Date(req.body.end_date)).format()
    },
    'attendees': [
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  for(i=0;i<emaillist.length;i++)
  event.attendees.push({
    'email':emaillist[i]
  });
  var calendar = google.calendar('v3');
  calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
    res.render("event",{ title: 'Event sucess',eventlink:event.htmlLink});
  });



  }
  });

});

module.exports = router;
