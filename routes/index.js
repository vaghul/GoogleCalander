/* Author: Vaghula Krishnan
*/
var express = require('express');
var router = express.Router();
var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');
var fs = require('fs');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '491339976599-v3m3u4cb9vetmphk0kbj3vr28lop2fl6.apps.googleusercontent.com';
var CLIENT_SECRET = 'KVQMxNC-NWKmKaFPLPXMAdhL';
var REDIRECT_URL = 'http://localhost:3000/users/';
//var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  //  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = __dirname+'/gmail-api-quickstart1.json';


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.post('/', function(req, res) {
  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


  function getAccessToken(oauth2Client, callback) {
    // generate consent page url
    var url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // will return a refresh token
      scope: ['https://www.googleapis.com/auth/plus.me','https://www.googleapis.com/auth/calendar'] // can be a space-delimited string or an array of scopes
    });
    console.log("redirecting to "+url);
    res.redirect(url);
    }


  // retrieve an access token
  getAccessToken(oauth2Client, function() {
    // retrieve user profile
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
      if (err) {
        console.log('An error occured', err);
        return;
      }
      console.log(profile.displayName, ':', profile.tagline);
    });
  });

  });
module.exports = router;
