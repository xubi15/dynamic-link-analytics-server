var express = require('express');
var router = express.Router();
var {google} = require("googleapis");
var axios = require('axios');

// Load the service account key JSON file.
var serviceAccount = require("../service_prod.json");

// Specify the required scope.
var scopes = [
    "https://www.googleapis.com/auth/firebase"
];

router.post('/', function (req, res, next) {

    var dynamicLinkPageUrl = req.body.url
    var dynamicLinkPageDays = parseInt(req.body.days)

    console.log("~: "+dynamicLinkPageDays+ ": "+dynamicLinkPageUrl)

    // Authenticate a JWT client with the service account.
    var jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        scopes
    );

    // Use the JWT client to generate an access token.
    jwtClient.authorize(function (error, tokens) {
        if (error) {
            console.log("Error making request to generate access token:", error);
        } else if (tokens.access_token === null) {
            console.log("Provided service account does not have permission to generate access tokens");
        } else {
            var accessToken = tokens.access_token;

            // Include the access token in the Authorization header.
            axios.get("https://firebasedynamiclinks.googleapis.com/v1/"+dynamicLinkPageUrl+"/linkStats?durationDays="+dynamicLinkPageDays, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).then(response => {
                var countSum = 0
                response.data.linkEventStats.map(data =>{
                    countSum += parseInt(data.count)
                })
                response.data.countSum = countSum
                res.json(response.data);
            }).catch(err => {
                console.log(err.message)
            })
        }
    });
});


module.exports = router;
