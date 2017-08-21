var tKeys = require('./keys.js')
var inquirer = require('inquirer');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');

inquirer.prompt([])

//grabs the keys from keys.js
var twitterKeys = new twitter(tKeys.twitterKeys)

//Twitter search parameters
var twitterParams = {
    screen_name: 'tyler_negro',
    count:10,
}


twitterKeys.get('statuses/user_timeline', twitterParams, function(error, tweets, response){
    if(!error){
        tweets.forEach(function(element) {
            console.log(element.text)
            console.log('=================== \n')
        }, this);
    }
})