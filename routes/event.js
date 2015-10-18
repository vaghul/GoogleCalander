/* Author: Vaghula Krishnan
*/
var express = require('express');
var router = express.Router();
var fs = require('fs');
var TOKEN_PATH = __dirname+'/gmail-api-quickstart.json';

/* GET home page. */
router.get('/', function(req, res) {

  fs.unlinkSync(TOKEN_PATH);
  console.log("Token file deleted");

  res.redirect('/');
});

module.exports = router;
